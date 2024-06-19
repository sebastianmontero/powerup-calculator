const {Resources, PowerUpState} = require('@wharfkit/resources');
const {APIClient} = require('@wharfkit/antelope');




async function main() {
  const resources = new Resources({
    url: 'https://eos.greymass.com',
    sampleAccount: 'dapp.beny',
    // apiClient: new APIClient({
    //   url: 'https://eos.greymass.com',
    // })
  });

  const powerup = await resources.v1.powerup.get_state()
  const sample = await resources.getSampledUsage()
  // console.log(sample.account.account_name.toString(), sample.cpu.toNumber(), sample.net.toNumber())

  const ms = 50
  const us = ms*1000
  const kb = 1024*1
  const bytes = kb*1024

  // const cpuWeight = powerup.cpu.us_to_weight(sample.cpu, us)
  // const netWeight = powerup.net.bytes_to_weight(sample.net, bytes)
  const cpuFrac = powerup.cpu.frac_by_us(sample, us)
  const netFrac = powerup.net.frac_by_bytes(sample, bytes)
  const cpuPrice = powerup.cpu.price_per_ms(sample, ms)
  const netPrice = powerup.net.price_per_kb(sample, kb)
  console.log(`ms: ${ms}, kb: ${kb}`)
  console.log(`netFrac: ${netFrac}, cpuFrac: ${cpuFrac}, cpuPrice: ${cpuPrice}, netPrice: ${netPrice}, total price: ${cpuPrice+netPrice}`)
  
}

(async () => {
  await main()
})()
