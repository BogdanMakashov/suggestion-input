import { RegisteredEntityType } from '@/enums';

export type RegisteredEntity = {
  type: RegisteredEntityType;
  alias: string;
  name: string | null;
  avatar: string | null;
};

export type RegisteredEntityList = RegisteredEntity[];

export type SuggestionItem<T> = T & {
  _key: string;
};