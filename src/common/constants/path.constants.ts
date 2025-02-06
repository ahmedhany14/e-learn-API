import * as console from 'node:console';

export class GeneratePathConstants {
  private readonly mapper = new Map<string, string>();

   constructor() {
    this.mapper.set('profile', 'profile');
    this.mapper.set('course', 'course');
  }

  private  generatePath(moduleName: string): string {
    return this.mapper.get(moduleName);
  }

   generatePathForProfile(id: number, moduleName: string): string {
    const dir_path = this.generatePath(moduleName);
    console.log('dir_path', dir_path)
    return `${dir_path}-image-${id}.jpg`;
  }
}
