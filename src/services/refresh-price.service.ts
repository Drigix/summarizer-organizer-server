import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RefreshPriceService {

  async getCurrentGoldOrSilverPrice(refreshUrl: string): Promise<any> {
    try {
      const response = await axios.get(refreshUrl);
      return response.data['sizeprices']['value'];
    } catch (error) {
      throw error;
    }
  }
}