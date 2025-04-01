export interface ChatType {
  id: string;
  user1Id: string | null;
  user2Id: string | null;
  user1Avatar: string | null;
  user2Avatar: string | null;
  lastMessage: string | null;
  lastMessageAt: Date | null;
};

export interface ChatsAndOtherUser extends ChatType {

  otherUser: {
    id: string;
    image: string;
    name: string;
  };
}


export interface MessageType {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}
