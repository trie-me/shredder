import {Task} from "./task";

export interface Job {
  uri: string;
  tasks: Task[];
  data?: { [key: string]: any }
}
