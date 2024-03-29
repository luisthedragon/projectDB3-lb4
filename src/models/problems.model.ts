import {Entity, model, property} from '@loopback/repository';

@model()
export class Problems extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  problemId?: number;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'boolean',
    required: true,
  })
  solved: boolean;

  @property({
    type: 'number',
    default: 0,
  })
  score?: number;

  @property({
    type: 'boolean',
    required: true,
  })
  isPrivate: boolean;

  @property({
    type: 'string',
    default: 0,
  })
  image?: string;

  @property({
    type: 'array',
    itemType: 'number',
  })
  usersWhoLike?: number[];

  @property({
    type: 'array',
    itemType: 'number',
  })
  usersWhoDislike?: number[];

  constructor(data?: Partial<Problems>) {
    super(data);
  }
}

export interface ProblemsRelations {
  // describe navigational properties here
}

export type ProblemsWithRelations = Problems & ProblemsRelations;
