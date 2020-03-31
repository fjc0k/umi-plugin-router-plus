import { IRoute } from 'umi'

export interface ISyntheticRoute extends IRoute {
  names: {
    page: string,
    QueryTypes: string,
  },
}
