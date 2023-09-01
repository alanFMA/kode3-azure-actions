import { Injectable } from '@nestjs/common';

const dataAPI = {
  component_id: "${{ values.component_id }}",
  description: "${{ values.description}}",
  owner: "${{ values.owner }}",
  programming: "${{ values.programming }}",
  multiselect: "${{ values.multiselect }}"
}

@Injectable()
export class AppService {
  getHello(): object {
    return { message: dataAPI };
  }
}
