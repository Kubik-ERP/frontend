import { IOutlet } from './index';

export interface IOutletListResponse {
  data: IOutlet[];
}

export interface IOutletListProvided {
  outletList_onContinue: () => void;
  outletList_dynamicClassOfSelectedOutlet: (outlet: IOutlet) => string;
  outletList_fetchOutletLists: () => Promise<IOutletListResponse>;
  outletList_isLoading: globalThis.Ref<boolean>;
  outletList_lists: Ref<IOutlet[]>;
  outletList_onSelectOutlet: (outlet: IOutlet) => void;
  outletList_selectedOutlet: Ref<IOutlet | null>;
}
