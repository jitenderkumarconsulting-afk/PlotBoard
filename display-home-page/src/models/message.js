import { IUser } from "./user";

 interface IMessage {
  id: number;
  owner: IUser;
  roomId: number;
  content: string;
}

 interface AddMessageDto {
  message: string;
  channelId: string;
}
