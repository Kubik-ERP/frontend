# 📝 Changelog Command

## Purpose
Generate a comprehensive changelog from git commits following Keep a Changelog format.

## Usage
```
/changelog [from-version] [to-version]
```

**Examples:**
```
/changelog v1.0.0 v1.1.0
/changelog v1.0.0 HEAD
/changelog --last-release
/changelog --unreleased
```

## Command Behavior

### 1. Analyze Git Commits
```bash
# Get commits between versions
git log v1.0.0..v1.1.0 --oneline --no-merges

# Get commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline --no-merges
```

### 2. Categorize Commits
Based on conventional commit format:
- `feat:` → **Added**
- `fix:` → **Fixed**
- `perf:` → **Changed** (Performance)
- `refactor:` → **Changed**
- `docs:` → **Documentation**
- `style:` → **Changed** (Style)
- `test:` → **Testing**
- `chore:` → (Usually omitted)
- `BREAKING CHANGE:` → **Breaking Changes**
- `security:` → **Security**

### 3. Generate Changelog Entry

## Output Format

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature 1 ([#PR](link))
- New feature 2 ([#PR](link))

### Changed
- Updated behavior 1 ([#PR](link))
- Improved performance of 2 ([#PR](link))

### Deprecated
- Old API endpoint X will be removed in v2.0.0

### Removed
- Removed legacy feature Y ([#PR](link))

### Fixed
- Fixed bug where Z happened ([#PR](link))
- Resolved issue with A ([#PR](link))

### Security
- Updated dependency X to fix CVE-YYYY-NNNNN
```

## Implementation

### Step 1: Fetch Commits
```typescript
interface CommitInfo {
  hash: string;
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking: boolean;
  pr?: string;
}

const parseCommit = (commitMessage: string): CommitInfo => {
  // Parse conventional commit format
  const conventionalRegex = /^(\w+)(?:\(([^)]+)\))?(!)?:\s(.+)$/;
  const match = commitMessage.match(conventionalRegex);
  
  if (!match) {
    return {
      hash: '',
      type: 'other',
      subject: commitMessage,
      breaking: false,
    };
  }
  
  return {
    hash: '',
    type: match[1],
    scope: match[2],
    subject: match[4],
    breaking: !!match[3],
  };
};
```

### Step 2: Group by Category
```typescript
interface ChangelogSection {
  added: CommitInfo[];
  changed: CommitInfo[];
  deprecated: CommitInfo[];
  removed: CommitInfo[];
  fixed: CommitInfo[];
  security: CommitInfo[];
}

const categorizeCommits = (commits: CommitInfo[]): ChangelogSection => {
  const sections: ChangelogSection = {
    added: [],
    changed: [],
    deprecated: [],
    removed: [],
    fixed: [],
    security: [],
  };
  
  commits.forEach(commit => {
    switch (commit.type) {
      case 'feat':
        sections.added.push(commit);
        break;
      case 'fix':
        sections.fixed.push(commit);
        break;
      case 'perf':
      case 'refactor':
      case 'style':
        sections.changed.push(commit);
        break;
      case 'security':
        sections.security.push(commit);
        break;
    }
    
    if (commit.breaking) {
      sections.deprecated.push(commit);
    }
  });
  
  return sections;
};
```

### Step 3: Format Output
```typescript
const formatChangelog = (
  version: string,
  date: string,
  sections: ChangelogSection
): string => {
  let changelog = `## [${version}] - ${date}\n\n`;
  
  const formatSection = (title: string, commits: CommitInfo[]) => {
    if (commits.length === 0) return '';
    
    let section = `### ${title}\n`;
    commits.forEach(commit => {
      const scope = commit.scope ? `**${commit.scope}**: ` : '';
      const pr = commit.pr ? ` ([#${commit.pr}](link))` : '';
      section += `- ${scope}${commit.subject}${pr}\n`;
    });
    section += '\n';
    return section;
  };
  
  changelog += formatSection('Added', sections.added);
  changelog += formatSection('Changed', sections.changed);
  changelog += formatSection('Deprecated', sections.deprecated);
  changelog += formatSection('Removed', sections.removed);
  changelog += formatSection('Fixed', sections.fixed);
  changelog += formatSection('Security', sections.security);
  
  return changelog;
};
```

## Example Output

### Command
```
/changelog v1.0.0 v1.1.0
```

### Generated Changelog
```markdown
## [1.1.0] - 2025-01-15

### Added
- **self-order**: Customer registration at checkout ([#123](https://github.com/org/repo/pull/123))
- **self-order**: Store image and name on login screen ([#124](https://github.com/org/repo/pull/124))
- **components**: New responsive button component ([#125](https://github.com/org/repo/pull/125))

### Changed
- **self-order**: Improved mobile checkout UI ([#126](https://github.com/org/repo/pull/126))
- **performance**: Optimized image loading with lazy loading ([#127](https://github.com/org/repo/pull/127))

### Fixed
- **self-order**: Fixed Sign In button navigation issue ([#128](https://github.com/org/repo/pull/128))
- **auth**: Resolved token refresh race condition ([#129](https://github.com/org/repo/pull/129))

### Security
- Updated axios to v1.6.5 to fix CVE-2024-XXXXX
```

## Options

### `--since-last-tag`
Generate changelog for commits since the last git tag:
```
/changelog --since-last-tag
```

### `--unreleased`
Generate changelog for unreleased changes (since last tag to HEAD):
```
/changelog --unreleased
```

### `--all`
Generate full changelog for entire project history:
```
/changelog --all
```

### `--output <file>`
Write changelog to file instead of displaying:
```
/changelog v1.0.0 v1.1.0 --output CHANGELOG.md
```

### `--append`
Append to existing CHANGELOG.md instead of creating new:
```
/changelog v1.0.0 v1.1.0 --append
```

## Commit Message Guidelines

For best results, follow conventional commit format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style/formatting
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance
- `security`: Security fix

**Examples:**
```
feat(self-order): add customer registration modal
fix(auth): resolve token refresh race condition
perf(images): implement lazy loading
docs(readme): update setup instructions
refactor(services): extract business logic to service layer
```

## Integration with CHANGELOG.md

### Update Existing Changelog
```bash
# 1. Generate new entry
/changelog --unreleased

# 2. Review generated content

# 3. Insert at top of CHANGELOG.md (after ## [Unreleased])

# 4. Update links at bottom
[1.1.0]: https://github.com/org/repo/compare/v1.0.0...v1.1.0
```

### Maintain Changelog Structure
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that will be in next release

## [1.1.0] - 2025-01-15

[Generated content here]

## [1.0.0] - 2024-12-01

[Previous release]

[Unreleased]: https://github.com/org/repo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/org/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/org/repo/releases/tag/v1.0.0
```

## Best Practices

1. **Run before releases**: Generate changelog as part of release process
2. **Review and edit**: Generated content may need manual refinement
3. **Group related changes**: Combine similar commits into single entries
4. **Add context**: Include why changes were made, not just what
5. **Link to PRs/issues**: Help readers find more details
6. **Keep it concise**: Focus on user-facing changes
7. **Be consistent**: Follow same format for all versions

## Notes

- Requires git repository
- Works best with conventional commit format
- Manual review recommended before publishing
- Breaking changes should be clearly highlighted
- Consider impact on different user types (developers, end-users, etc.)

---

**Command Version**: 1.0.0
**Last Updated**: November 23, 2025
