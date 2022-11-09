(async () => {
  const root = document.getElementById('root');
  root.innerHTML = `
        <div style="margin: 0 auto;">LOADING...</div>
    `;
  const {registerRootComponent} = await import('expo');
  const AppWeb = await import('./src/AppWeb');
  registerRootComponent(AppWeb.default);
})();
