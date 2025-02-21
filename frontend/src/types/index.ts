export interface User {
  uuid: string;
  name: string;
  isRoot: boolean;
  isActived: boolean;
  creationDate: string;
  updatedDate: string;
}

export interface Color {
  uuid: string;
  colorName: string;
}

export interface Model {
  uuid: string;
  modelName: string;
}

export interface Vehicle {
  uuid: string;
  model: {
    uuid: string;
    modelName: string;
  };
  color: {
    uuid: string;
    colorName: string;
  };
  year: number;
  creationDate: string;
  updatedDate: string;
  creationUserName: string;
  updatedUserName: string;
  imagePath: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FiltersState {
  model: string;
  color: string;
  year: string;
  creationDate: string;
}