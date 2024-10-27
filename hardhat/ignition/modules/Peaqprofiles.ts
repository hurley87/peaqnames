import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const PeaqprofilesModule = buildModule('PeaqprofilesModule', (m) => {
  const peaqprofiles = m.contract('Peaqprofiles', []);

  return { peaqprofiles };
});

export default PeaqprofilesModule;
