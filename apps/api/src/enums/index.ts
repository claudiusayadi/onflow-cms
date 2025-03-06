import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  reader = 'reader',
  writer = 'writer',
  editor = 'editor',
  admin = 'admin',
}

export enum Status {
  draft = 'draft',
  published = 'published',
  deleted = 'deleted',
}

export enum SortField {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  title = 'title',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(Role, { name: 'Role' });
registerEnumType(Status, { name: 'Status' });
registerEnumType(SortField, { name: 'SortField' });
registerEnumType(SortOrder, { name: 'SortOrder' });
