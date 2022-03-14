import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TCP_CHANNEL_USER_SERVICE } from '../commons/tcp-channel';
@Injectable()
export class TcpTransport {
  constructor(
    @Inject('USER_SERVICE') 
    private userClient: ClientProxy
  ){}

  async sendMessageUserService<T = any>(channel: TCP_CHANNEL_USER_SERVICE, data: any): Promise<T> {
    const sendData = this.userClient.send(channel, data)
    return await sendData.toPromise();
  }
}