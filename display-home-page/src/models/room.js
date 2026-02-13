import { IUser } from "./user";

 interface IRoom {
  id: number;
  owner: IUser;
  title: string;
  description: string;
  members: IUser[];
}

 interface AddRoomDto {
  title: string;
  description: string;
}

 interface UpdateRoomDto {
  id: number;
  title?: string;
  description?: string;
}

 interface SearchRoomsDto {
  title?: string;
  ownerId?: number;
}
