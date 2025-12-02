// Interfaces
import type { IMenuRecipe, IMenuRecipeListVersion } from './menu-recipe-store.interface';

export interface IMenuRecipeDetailProvided {
  menuRecipeDetail_calculatedMarginPercent: globalThis.ComputedRef<number>;
  menuRecipeDetail_calculatedMarginRp: globalThis.ComputedRef<number>;
  menuRecipeDetail_calculateIngredientCost: (ingredient: unknown) => number;
  menuRecipeDetail_data: globalThis.Ref<IMenuRecipe | null>;
  menuRecipeDetail_fetchDetails: () => Promise<unknown>;
  menuRecipeDetail_fetchDelete: () => Promise<unknown>;
  menuRecipeDetail_fetchVersionDetail: (versionId: string) => Promise<unknown>;
  menuRecipeDetail_fetchVersions: () => Promise<unknown>;
  menuRecipeDetail_isLoading: globalThis.Ref<boolean>;
  menuRecipeDetail_listColumns: IColumnDataTable[];
  menuRecipeDetail_onBack: () => void;
  menuRecipeDetail_onCancelDialogDeleteConfirmation: () => void;
  menuRecipeDetail_onEdit: () => void;
  menuRecipeDetail_onLoadInitialData: () => Promise<void>;
  menuRecipeDetail_onResetToCurrentVersion: () => void;
  menuRecipeDetail_onSelectVersion: (versionId: string) => void;
  menuRecipeDetail_onShowDialogDeleteConfirmation: () => void;
  menuRecipeDetail_selectedVersionId: globalThis.Ref<string | null>;
  menuRecipeDetail_totalCostPortion: globalThis.ComputedRef<number>;
  menuRecipeDetail_versions: globalThis.Ref<IMenuRecipeListVersion | null>;
}
