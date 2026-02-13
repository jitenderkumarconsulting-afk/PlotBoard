 interface IUser {
  id: number;
  name: string;
  bio?: string;
  email: string;
  avatarUrl: string;
}

 interface UpdateUserDto {
  name?: string;
  bio?: string;
  email?: string;
}

 interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

 interface SearchUsersDto {
  name: string;
}
