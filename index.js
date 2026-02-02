const { Resources } = require('@wharfkit/resources');


async function main() {
  let requests = [
    { account: 'nftmarb.beny', ms: 2000, mb: 2 },
    { account: 'yldrex1.beny', ms: 20, mb: 3 },
    { account: 'yldrex2.beny', ms: 20, mb: 3 },
    { account: 'xchg.beny', ms: 20, mb: 3 },
    { account: 'gqztoojrgqge', ms: 200, mb: 2 },
    { account: 'rng1.beny', ms: 5, kb: 100 },
    { account: 'rng2.beny', ms: 5, kb: 100 },
    { account: 'rng3.beny', ms: 5, kb: 100 },
    { account: 'rngadm.beny', ms: 5, kb: 100 },
    { account: 'dapp.beny', ms: 100, mb: 7 },
  ];


  // const resources = new Resources({
  //   url: 'https://eos.greymass.com',
  //   sampleAccount: 'dapp.beny',
  //   // apiClient: new APIClient({
  //   //   url: 'https://eos.greymass.com',
  //   // })
  // });

  // const resources = new Resources({
  //   url: 'https://exsat2.greymass.com',
  //   sampleAccount: 'bennystklcl2',
  //   // apiClient: new APIClient({
  //   //   url: 'https://eos.greymass.com',
  //   // })
  // });

  const resources = new Resources({
    url: 'https://jungle4.cryptolions.io',
    sampleAccount: 'bennyfitest1',
    // apiClient: new APIClient({
    //   url: 'https://eos.greymass.com',
    // })
  });

  const powerup = await resources.v1.powerup.get_state()
  const sample = await resources.getSampledUsage()
  // console.log(sample.account.account_name.toString(), sample.cpu.toNumber(), sample.net.toNumber())

  // const ms = 20
  // const us = ms*1000
  // const kb = 1024*2
  // const bytes = kb*1024

  requests = requests.map(({ account, ms, us, mb, kb, b }) => {
    if (!mb && !kb && !b) {
      throw new Error('must specify one of mb, kb, b')
    }
    if (!us && !ms) {
      throw new Error('must specify one of us, ms')
    }
    if (kb) {
      b = kb * 1024
    } else if (mb) {
      b = mb * 1024 * 1024
    }
    if (ms) {
      us = ms * 1000
    }
    const cpuFrac = powerup.cpu.frac_by_us(sample, us)
    const netFrac = powerup.net.frac_by_bytes(sample, b)
    const cpuPrice = powerup.cpu.price_per_us(sample, us)
    const netPrice = powerup.net.price_per_byte(sample, b)
    const totalPrice = (cpuPrice + netPrice).toFixed(4)
    ms = us / 1000
    kb = b / 1024
    mb = kb / 1024
    console.log(`account: ${account}, us: ${us}, b: ${b}, cpuFrac: ${cpuFrac}, netFrac: ${netFrac}, totalPrice: ${totalPrice}, ms: ${ms}, kb: ${kb}, mb: ${mb}`)
    return {
      account,
      us,
      b,
      cpuFrac,
      netFrac,
      cpuPrice,
      netPrice,
      totalPrice
    }
  })
  console.log("")
  requests.forEach(async ({ account, cpuFrac, netFrac, totalPrice }) => {
    console.log(`cleos --url=https://eos.greymass.com push action eosio powerup '["dapp.beny", "${account}", "1", "${netFrac}", "${cpuFrac}", "${totalPrice} EOS"]' -p dapp.beny`)
  })

  // // const cpuWeight = powerup.cpu.us_to_weight(sample.cpu, us)
  // // const netWeight = powerup.net.bytes_to_weight(sample.net, bytes)
  // const cpuFrac = powerup.cpu.frac_by_us(sample, us)
  // const netFrac = powerup.net.frac_by_bytes(sample, bytes)
  // const cpuPrice = powerup.cpu.price_per_ms(sample, ms)
  // const netPrice = powerup.net.price_per_kb(sample, kb)
  // console.log(`ms: ${ms}, kb: ${kb}`)
  // const totalPrice = (cpuPrice+netPrice).toFixed(4)
  // console.log(`netFrac: ${netFrac}, cpuFrac: ${cpuFrac}, cpuPrice: ${cpuPrice}, netPrice: ${netPrice}, total price: ${totalPrice}`)
  // console.log(`cleos --url=https://eos.greymass.com push action eosio powerup '["dapp.beny", "${account}", "1", "${netFrac}", "${cpuFrac}", "${totalPrice} EOS"]' -p dapp.beny`)

}

(async () => {
  await main()
})()
