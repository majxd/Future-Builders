
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface StoryPart {
  role: Role;
  text: string;
}

export type Story = StoryPart[];
