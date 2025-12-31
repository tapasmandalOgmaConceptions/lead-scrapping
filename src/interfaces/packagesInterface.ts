import { PackageTabsValue } from "../enum/templateNoteEnum";
import { WorkPackageResponse } from "./templateNoteInterface";

export interface PackageListProps {
  packages: WorkPackageResponse[];
  loading: boolean;
  tabName: PackageTabsValue;
  setPageValue: (value: number) => void;
  setKeyword: (value: string) => void;
  page: number;
  totalPage: number;
}
