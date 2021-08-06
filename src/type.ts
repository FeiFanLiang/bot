import {Context,Scenes} from 'telegraf'


export interface MySession extends Scenes.WizardSession {
  // will be available under `ctx.session.mySessionProp`
  amount: number;
  username: string;
}

export interface MyContext extends Context {
  // will be available under `ctx.myContextProp`
  myContextProp: string;
  // declare session type
  session: MySession;
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<MyContext>;
}