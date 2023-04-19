import Base from './base';
import { HealthCheckResponse } from './responses';

export default class HealthCheck extends Base {
  ping(): Promise<HealthCheckResponse> {
    return this.apiClient.get('ping');
  }
}
