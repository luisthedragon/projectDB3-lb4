import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Comments} from '../models';
import {CommentsRepository} from '../repositories';

export class CommentsController {
  constructor(
    @repository(CommentsRepository)
    public commentsRepository : CommentsRepository,
  ) {}

  @post('/comments', {
    responses: {
      '200': {
        description: 'Comments model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comments)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comments, {
            title: 'NewComments',
            exclude: ['id'],
          }),
        },
      },
    })
    comments: Omit<Comments, 'id'>,
  ): Promise<Comments> {
    return this.commentsRepository.create(comments);
  }

  @get('/comments/count', {
    responses: {
      '200': {
        description: 'Comments model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Comments) where?: Where<Comments>,
  ): Promise<Count> {
    return this.commentsRepository.count(where);
  }

  @get('/comments', {
    responses: {
      '200': {
        description: 'Array of Comments model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Comments, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Comments) filter?: Filter<Comments>,
  ): Promise<Comments[]> {
    return this.commentsRepository.find(filter);
  }

  @get('/comments/lookup/users', {
    responses: {
      '200': {
        description: 'Array of Comments model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Comments, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async lookup_users(
    @param.filter(Comments) filter?: Filter<Comments>,
  ): Promise<Comments[]> {
    return (this.commentsRepository.dataSource.connector as any)
    .collection("Comments")
    .aggregate([
      {
        $lookup:{
          from: "Users",
          localField: "userId",
          foreignField: "userId",
          as: "user"
        }
      },{
        $unwind:"$user"
      }
      ])
    .get();
  }

  @get('/comments/lookup/problems', {
    responses: {
      '200': {
        description: 'Array of Comments model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Comments, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async lookup_problems(
    @param.filter(Comments) filter?: Filter<Comments>,
  ): Promise<Comments[]> {
    return (this.commentsRepository.dataSource.connector as any)
    .collection("Comments")
    .aggregate([
      {
        $lookup:{
          from: "Problems",
          localField: "problemId",
          foreignField: "problemId",
          as: "problem"
        }
      },{
        $unwind:"$problem"
      }
      ])
    .get();
  }

  @get('/comments/mostCommentedProblem', {
    responses: {
      '200': {
        description: 'Most commented problem',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Comments, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async mostCommentedProblem(
    @param.filter(Comments) filter?: Filter<Comments>,
  ): Promise<Comments[]> {
    return (this.commentsRepository.dataSource.connector as any)
    .collection("Comments")
    .aggregate([
      {
        $group:{
          _id:"$problemId",
          count:{
            $sum:1
          }
        }
      }
      ])
    .get();
  }

  @patch('/comments', {
    responses: {
      '200': {
        description: 'Comments PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comments, {partial: true}),
        },
      },
    })
    comments: Comments,
    @param.where(Comments) where?: Where<Comments>,
  ): Promise<Count> {
    return this.commentsRepository.updateAll(comments, where);
  }

  @get('/comments/{id}', {
    responses: {
      '200': {
        description: 'Comments model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Comments, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Comments, {exclude: 'where'}) filter?: FilterExcludingWhere<Comments>
  ): Promise<Comments> {
    return this.commentsRepository.findById(id, filter);
  }

  @patch('/comments/{id}', {
    responses: {
      '204': {
        description: 'Comments PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comments, {partial: true}),
        },
      },
    })
    comments: Comments,
  ): Promise<void> {
    await this.commentsRepository.updateById(id, comments);
  }

  @put('/comments/{id}', {
    responses: {
      '204': {
        description: 'Comments PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() comments: Comments,
  ): Promise<void> {
    await this.commentsRepository.replaceById(id, comments);
  }

  @del('/comments/{id}', {
    responses: {
      '204': {
        description: 'Comments DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.commentsRepository.deleteById(id);
  }
}
