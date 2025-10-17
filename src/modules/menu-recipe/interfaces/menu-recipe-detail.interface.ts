// Interfaces
import type { IMenuRecipe } from './menu-recipe-store.interface';

export interface IMenuRecipeDetailProvided {
  menuRecipeDetail_data: globalThis.Ref<IMenuRecipe | null>;
  menuRecipeDetail_fetchDetails: () => Promise<unknown>;
  menuRecipeDetail_fetchDelete: () => Promise<unknown>;
  menuRecipeDetail_isLoading: globalThis.Ref<boolean>;
  menuRecipeDetail_listColumns: IColumnDataTable[];
  menuRecipeDetail_onBack: () => void;
  menuRecipeDetail_onCancelDialogDeleteConfirmation: () => void;
  menuRecipeDetail_onEdit: () => void;
  menuRecipeDetail_onLoadInitialData: () => Promise<void>;
  menuRecipeDetail_onShowDialogDeleteConfirmation: () => void;
}
