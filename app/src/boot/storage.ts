import { QVueGlobals, WebStorageGetMethodReturnType } from 'quasar';
import { boot } from 'quasar/wrappers';

class Storage {
  isServer: boolean;
  $q : QVueGlobals;

  constructor(isServer: boolean, $q: QVueGlobals) {
    this.isServer = isServer;
    this.$q = $q;
  }

  async set(key: string, value: unknown) {
    if (this.isServer) {
      /** @todo add database */
      return;
    }

    this.$q.localStorage.set(key, value);
  }

  async get(key: string) : Promise<WebStorageGetMethodReturnType | null> {
    if (this.isServer) {
      /** @todo get from database */
      return null;
    }

    return this.$q.localStorage.getItem(key);
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $storage: Storage;
  }
}

export default boot((params) => {
  const { app } = params;
  let ssrContext;
  if (params.hasOwnProperty('ssrContext')) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ssrContext = params.ssrContext;
  }
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$storage = new Storage(!!ssrContext, app.config.globalProperties.$q);
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
});
