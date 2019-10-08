// Maps provider-factory

const option_factory_mappings = ({
  'http://localhost:8545': '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
  'private': '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
  'ropsten': '0xBcafbb9e481633B9A12Ae4DcFA6e35735542fCF2',
  'rinkeby': '0xF746f1E86617920c9933A2a39CAbAc7dCeaAB5E8',
});

const silent_option_factory_mappings = ({
  'http://localhost:8545': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  'private': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  'rinkeby': '0xb0282cBCd5E36ECeB83313DCEeC2b65EaFe3A57e',
});

const local_token_mappings = ({
  'a': '0x59d3631c86BbE35EF041872d502F218A39FBa150',
  'b': '0xD3aA556287Afe63102e5797BFDDd2A1E8DbB3eA5',
});

const ropsten_token_mappings = ({
  'a': '0x04156193A576e1D8B00d72A41e773EC08F32Da41',
  'b': '0x8539E31BE22DE64d51477Ce9930d7b1aCBFe2b47',
});

const rinkeby_token_mappings = ({
  'a': '0x1fF7E7ca119B389aBa279afc7E71De65aeA24500',
  'b': '0x82Ef83965bA1d074B4b3Aaa132d362309de10E85',
});

module.exports.option_factory_mappings = option_factory_mappings;
module.exports.silent_option_factory_mappings = silent_option_factory_mappings;
module.exports.local_token_mappings = local_token_mappings;
