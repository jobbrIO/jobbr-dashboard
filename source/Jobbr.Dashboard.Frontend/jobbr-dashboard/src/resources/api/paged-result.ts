export class PagedResult<T> {
  public page: number;
  public pageSize: number;
  public totalItems: number;
  public items: Array<T>;
}
