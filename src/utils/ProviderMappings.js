// Maps provider-factory

const option_factory_mappings = ({
  'http://localhost:8545': '0xCfEB869F69431e42cdB54A4F4f105C19C080A601',
  'private': '0xCfEB869F69431e42cdB54A4F4f105C19C080A601',
  'rinkeby': '0xafF7c772D52E153C4Dbef94f2B86102bB232F70d',
});

const silent_option_factory_mappings = ({
  'http://localhost:8545': '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
  'private': '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
  'rinkeby': '0x9380Ed33904F2AEd5Cf3d0042CC27Dd2CE49a406',
});

const local_token_mappings = ({
  'a': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  'b': '0xD3aA556287Afe63102e5797BFDDd2A1E8DbB3eA5',
});

const rinkeby_token_mappings = ({
  'a': '0x86abBC560adBe54CCb2ddfDb58A4Cf11e930396B',
  'b': '0x900D84D4558b1ef6C2103b361F9aA14ac8Df227A',
});

module.exports.option_factory_mappings = option_factory_mappings;
module.exports.silent_option_factory_mappings = silent_option_factory_mappings;
module.exports.local_token_mappings = local_token_mappings;
