// Maps provider-factory

const option_factory_mappings = ({
  'http://localhost:8545': '0xCfEB869F69431e42cdB54A4F4f105C19C080A601',
  'private': '0xCfEB869F69431e42cdB54A4F4f105C19C080A601',
  'rinkeby': '0x3822cBa35E3852cAd6216dF77C6a5D5a7161D614',
});

const silent_option_factory_mappings = ({
  'http://localhost:8545': '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
  'private': '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
  'rinkeby': '0x2bbf14418Ff723306Aee412B61ac16a3DcF2F9Cd',
});

const tokenized_option_factory_mappings = ({
  'http://localhost:8545': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  'private': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  'rinkeby': '0x7EF97F5a887998CCeE8C78e858792Cb7E46B2Ecc',
});

const forward_factory_mappings = ({
  'http://localhost:8545': '0x59d3631c86BbE35EF041872d502F218A39FBa150',
  'private': '0x59d3631c86BbE35EF041872d502F218A39FBa150',
  'rinkeby': '0xb1A8e083867515de47BA62290E72109623466dF9',
});

const portfolio_factory_mappings = ({
  'http://localhost:8545': '0x9b1f7F645351AF3631a656421eD2e40f2802E6c0',
  'private': '0x9b1f7F645351AF3631a656421eD2e40f2802E6c0',
  'rinkeby': '0xaE2c4B48F7DbA7571e4e4e69Ba80F50c9A02532d',
});

const managed_forward_factory_mappings = ({
  'http://localhost:8545': '0x67B5656d60a809915323Bf2C40A8bEF15A152e3e',
  'private': '0x67B5656d60a809915323Bf2C40A8bEF15A152e3e',
  'rinkeby': '0x712cB4F4Aac86Eed80D0EF1E9F69CA9F52F8117b',
});

const local_token_mappings = ({
  'a': '0xA57B8a5584442B467b4689F1144D269d096A3daF',
  'b': '0xD3aA556287Afe63102e5797BFDDd2A1E8DbB3eA5',
});

const rinkeby_token_mappings = ({
  'a': '0xEa774D3A6Eb116E474E5d723d1Ee34660B4708E5',
  'b': '0xf70E4D59A9268d777996e00aB41604D40936BD12',
});

module.exports.option_factory_mappings = option_factory_mappings;
module.exports.silent_option_factory_mappings = silent_option_factory_mappings;
module.exports.tokenized_option_factory_mappings = tokenized_option_factory_mappings;
module.exports.forward_factory_mappings = forward_factory_mappings;
module.exports.portfolio_factory_mappings = portfolio_factory_mappings;
module.exports.managed_forward_factory_mappings = managed_forward_factory_mappings;
module.exports.local_token_mappings = local_token_mappings;
