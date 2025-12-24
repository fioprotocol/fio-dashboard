import { JiraCandidates } from '../types/governance';
import Base from './base';

export default class Jira extends Base {
  getJiraCandidatesForPublicKey = async ({
    publicKey,
  }: {
    publicKey: string;
  }): Promise<JiraCandidates> => {
    return this.apiClient.get(`jira-candidates/${publicKey}`);
  };

  getJiraCandidates = async (): Promise<JiraCandidates> => {
    return this.apiClient.get('jira-candidates');
  };
}
