/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/overdue-modal`; params?: Router.UnknownInputParams; } | { pathname: `/remove-modal`; params?: Router.UnknownInputParams; } | { pathname: `/task-modal`; params?: Router.UnknownInputParams; } | { pathname: `/todo-scrollview`; params?: Router.UnknownInputParams; } | { pathname: `/todo`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/login`; params?: Router.UnknownOutputParams; } | { pathname: `/overdue-modal`; params?: Router.UnknownOutputParams; } | { pathname: `/remove-modal`; params?: Router.UnknownOutputParams; } | { pathname: `/task-modal`; params?: Router.UnknownOutputParams; } | { pathname: `/todo-scrollview`; params?: Router.UnknownOutputParams; } | { pathname: `/todo`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/login${`?${string}` | `#${string}` | ''}` | `/overdue-modal${`?${string}` | `#${string}` | ''}` | `/remove-modal${`?${string}` | `#${string}` | ''}` | `/task-modal${`?${string}` | `#${string}` | ''}` | `/todo-scrollview${`?${string}` | `#${string}` | ''}` | `/todo${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/overdue-modal`; params?: Router.UnknownInputParams; } | { pathname: `/remove-modal`; params?: Router.UnknownInputParams; } | { pathname: `/task-modal`; params?: Router.UnknownInputParams; } | { pathname: `/todo-scrollview`; params?: Router.UnknownInputParams; } | { pathname: `/todo`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
