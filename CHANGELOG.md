# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.7.7](https://github.com/tape-testing/testling/compare/v1.7.6...v1.7.7) - 2024-09-26

### Commits

- [Dev Deps] update `auto-changelog`, `tape` [`33eca43`](https://github.com/tape-testing/testling/commit/33eca438379cf16938eb1d6f1b731b1a2ac247f7)
- [Deps] update `jsonify`, `object-inspect` [`df687fd`](https://github.com/tape-testing/testling/commit/df687fd2be01c886e1c8bfbc16dbe8acef306865)
- [meta] Fix 404 url in package.json [`e777504`](https://github.com/tape-testing/testling/commit/e7775040f5861f83ee6ff025c62ab440387b527f)

## [v1.7.6](https://github.com/tape-testing/testling/compare/v1.7.5...v1.7.6) - 2024-06-21

### Commits

- [meta] update URLs [`8bff197`](https://github.com/tape-testing/testling/commit/8bff1978a722196f10a09f4ee2ef5177578cf9d4)
- [Deps] update `ent` [`0ceebda`](https://github.com/tape-testing/testling/commit/0ceebdad8f7066498e1c089f3c9f75b04c017a07)
- [Dev Deps] update `tape` [`330920d`](https://github.com/tape-testing/testling/commit/330920d39aa0257f307e92c765e1212daea2aebe)

## [v1.7.5](https://github.com/tape-testing/testling/compare/v1.7.4...v1.7.5) - 2024-02-15

### Commits

- [Deps] update `object-inspect`, `resolve`, `shell-quote` [`eeba066`](https://github.com/tape-testing/testling/commit/eeba06600c3be24bc1994ef7f8bb43f78d8280ef)
- [Fix] render a `&lt;br /&gt;` instead of a newline, for IE &lt; 8 [`e7b99cf`](https://github.com/tape-testing/testling/commit/e7b99cff36b9b9d1aae13eb260deef2471cb53c2)
- [Dev Deps] use `^` [`74b1923`](https://github.com/tape-testing/testling/commit/74b19234c3b52bd8820e1a1741b1582dd9a2d979)
- [Deps] update `object-inspect`, `resolve` [`28ace20`](https://github.com/tape-testing/testling/commit/28ace20c07a9a544f806de76177672ce46d54dd0)
- [Dev Deps] update `tape` [`6b716f2`](https://github.com/tape-testing/testling/commit/6b716f27e3044808f1667adf78305b7c158d4973)
- [Dev Deps] update `tape` [`50ee689`](https://github.com/tape-testing/testling/commit/50ee689877dbaa9e7c82d570e7763c1a8c7960fa)
- [Deps] update `resolve` [`a7ab4ee`](https://github.com/tape-testing/testling/commit/a7ab4eef214581fe3bd54444bbde94a25bdc698d)
- [Dev Deps] update `tape` [`8e2490e`](https://github.com/tape-testing/testling/commit/8e2490e995eaffdd841cdb305f2d20671ae58f6f)

## [v1.7.4](https://github.com/tape-testing/testling/compare/v1.7.3...v1.7.4) - 2022-09-22

### Fixed

- [Deps] switch `win-spawn` to `cross-spawn` [`#100`](https://github.com/tape-testing/testling/issues/100)
- [Fix] avoid websocket prelude when `--html` [`#122`](https://github.com/tape-testing/testling/issues/122)

### Commits

- [meta] add `auto-changelog` [`11e951e`](https://github.com/tape-testing/testling/commit/11e951e5e13bcbf3ab2225015a6b69666605ef7f)
- [Refactor] elses should be cuddled [`c85152c`](https://github.com/tape-testing/testling/commit/c85152c4cd407adde7f6adee34f691e1e5e24ce4)
- [meta] create FUNDING.yml; add `funding` in package.json [`b407a2f`](https://github.com/tape-testing/testling/commit/b407a2fc03cf52a549ae50287ebe5caa1110e6f1)
- [Dev Deps] update `rimraf`, `safe-publish-latest`, `tape` [`32909bc`](https://github.com/tape-testing/testling/commit/32909bceeaee0cec6c6c616cb436413ad82c29da)
- [Refactor] use `[].concat` for maybe-array [`122d27b`](https://github.com/tape-testing/testling/commit/122d27bc0cf20cb5e7612ed8c583549096596643)
- [Deps] update `concat-stream`, `object-inspect`, `optimist`, `resolve`, `shell-quote` [`12665da`](https://github.com/tape-testing/testling/commit/12665da4762594272374f6e09261f2e7d8e86cd3)
- [Deps] update `@tapjs/tap-finished` [`2d288b5`](https://github.com/tape-testing/testling/commit/2d288b513ba8a8a64b8bcd9251d6d6ea183fd857)
- [Deps] replace `tap-finished` with `@tapjs/finished` [`fc9795b`](https://github.com/tape-testing/testling/commit/fc9795b17b35c5d7ada287bd1a614a5a19df604b)
- [meta] bump engines.node to v0.8, since `through2` has never supported node v0.6 [`7819dac`](https://github.com/tape-testing/testling/commit/7819dac701011a2d6c55de5f8a74aa9ff1de6585)
- [Deps] update `browserify` [`9aee7b2`](https://github.com/tape-testing/testling/commit/9aee7b2b2e52ad40197e84d716f1aee66e310dcd)
- [Deps] update `browser-launcher` [`33436d5`](https://github.com/tape-testing/testling/commit/33436d5d3bec0692cdeb3a6ad82f35142ec2a103)

## [v1.7.3](https://github.com/tape-testing/testling/compare/v1.7.2...v1.7.3) - 2020-01-18

### Commits

- [meta] do not npmignore `bundle` dir [`903f373`](https://github.com/tape-testing/testling/commit/903f373e52c33eef117dd3c2f77d34f0be729f55)
- [Docs] testling_field.markdown: Added missing comma to browsers array [`3315964`](https://github.com/tape-testing/testling/commit/33159646ea48f2c3b6a1cfb8c3b1fad71adea1f9)

## [v1.7.2](https://github.com/tape-testing/testling/compare/v1.7.1...v1.7.2) - 2020-01-12

### Fixed

- [Fix] Keep track of browser process and manually kill [`#61`](https://github.com/tape-testing/testling/issues/61) [`#71`](https://github.com/tape-testing/testling/issues/71)
- [meta] remove nonexistent "main" [`#102`](https://github.com/tape-testing/testling/issues/102)
- [New] add way to tell the browser to connect to a specific host and port. [`#78`](https://github.com/tape-testing/testling/issues/78) [`#115`](https://github.com/tape-testing/testling/issues/115)

### Commits

- [meta] let npm reformat package.json [`2443fad`](https://github.com/tape-testing/testling/commit/2443fadaea4393fa941ff5e0b653d1be6f07d9dc)
- [meta] update LICENSE so github can detect it [`825a283`](https://github.com/tape-testing/testling/commit/825a28340b13dff740f29e0b6ee1eca91c08be72)
- [Deps] update `bouncy`, `browser-launcher`, `concat-stream`, `ecstatic`, `ent`, `glob`, `object-inspect`, `resolve`, `shallow-copy`, `shell-quote`, `tap-finished` [`5d932f0`](https://github.com/tape-testing/testling/commit/5d932f0a5e91540b41cc44d5c188dac575f03a0f)
- [Refactor] add some missing semicolons [`252c22d`](https://github.com/tape-testing/testling/commit/252c22d5f42198b273bf9cf7f5487142138f0a40)
- [Refactor] remove unused variable [`b1aabde`](https://github.com/tape-testing/testling/commit/b1aabde851edc53ca1cf4efcfb8159ded00bed31)
- [meta] gitignore node_modules and build output [`953fdd1`](https://github.com/tape-testing/testling/commit/953fdd13968a2b835ac508165454e3a574254763)
- [Fix] ensure proper spacing in error message [`2d42973`](https://github.com/tape-testing/testling/commit/2d42973389905231e57bd9df9dee4053f3647770)
- [patch] Printing detected browsers and a few hints if no suitable browser is found [`ad85978`](https://github.com/tape-testing/testling/commit/ad859786273e6d8a2c263c99fb423bedb2014404)
- Only apps should have lockfiles [`0630d9e`](https://github.com/tape-testing/testling/commit/0630d9e0c255cec3474f4e3535280e3eff15d07d)
- [meta] add `safe-publish-latest` [`63fd18f`](https://github.com/tape-testing/testling/commit/63fd18f3ac91368b78dcf6e67fa070fb57f50381)
- [readme] Add PhantomJS as a dependency [`d0383a7`](https://github.com/tape-testing/testling/commit/d0383a78b9450d1f8e1ea9d074f3c05bbb7d7a2e)
- Fix typo [`1383142`](https://github.com/tape-testing/testling/commit/138314284d38aea41a15bdac2e8e5e14932b2a25)
- [Dev Deps] update `tape` [`72a1ff9`](https://github.com/tape-testing/testling/commit/72a1ff9e310c5af93ec4c1ed69c62d9696cfcab3)
- [meta] set npm save prefix [`45e81fa`](https://github.com/tape-testing/testling/commit/45e81fa6c8e8727b209357feb78346363631e4c3)
- [Fix] remove `bundledDependencies` of `browser-launcher`, unneeded since 6a4ee9a5 [`af97334`](https://github.com/tape-testing/testling/commit/af973340960731ac67574f47270375e7f42394bb)

## [v1.7.1](https://github.com/tape-testing/testling/compare/v1.7.0...v1.7.1) - 2014-09-20

### Merged

- Make testling CLI work on windows [`#98`](https://github.com/tape-testing/testling/pull/98)
- Added a hint about browserify transformations to preprocess section [`#65`](https://github.com/tape-testing/testling/pull/65)

### Commits

- Update package.json [`659428e`](https://github.com/tape-testing/testling/commit/659428ed1c960abf710ccdde83b49f4d1d0f8ba7)
- Update cmd.js [`2458210`](https://github.com/tape-testing/testling/commit/245821057938eca7961526ae22b1f361ec35e1aa)

## [v1.7.0](https://github.com/tape-testing/testling/compare/v1.6.1...v1.7.0) - 2014-06-23

### Commits

- Implement preprocess [`9491595`](https://github.com/tape-testing/testling/commit/94915954ffc02b6f7443343ec3d389b4affd3eb3)
- Preprocessing should not prevent other processing [`22c3f31`](https://github.com/tape-testing/testling/commit/22c3f31b2e2f5d000d2b61e139eaad9315d2dd59)
- Add additional pending operation when preprocessing [`5da513d`](https://github.com/tape-testing/testling/commit/5da513d0b667c11ba2848d2fa8e7e70838ebad09)

## [v1.6.1](https://github.com/tape-testing/testling/compare/v1.6.0...v1.6.1) - 2014-03-08

### Commits

- don't depend on calling browser-launcher with -x [`8cec97c`](https://github.com/tape-testing/testling/commit/8cec97cfeeb43adbf5e974ce093d0cf3f7974c68)

## [v1.6.0](https://github.com/tape-testing/testling/compare/v1.5.9...v1.6.0) - 2014-02-01

### Commits

- 3x [`c3630ed`](https://github.com/tape-testing/testling/commit/c3630ed3ed8c132adae57a1625989d76c969a323)

## [v1.5.9](https://github.com/tape-testing/testling/compare/v1.5.8...v1.5.9) - 2014-01-25

### Commits

- Unbreak `testling -u` on OS X [`28e20eb`](https://github.com/tape-testing/testling/commit/28e20eb83b254c24c8bd91293523474789f85ed5)

## [v1.5.8](https://github.com/tape-testing/testling/compare/v1.5.7...v1.5.8) - 2014-01-23

### Commits

- don't check headless on linux or bsd [`85311db`](https://github.com/tape-testing/testling/commit/85311dbca8e329b33e5d602c4d22039237b718a5)
- be less annoying [`4e7cc6f`](https://github.com/tape-testing/testling/commit/4e7cc6fa59de19ecebdeff6ce5da8c3f54ced935)

## [v1.5.7](https://github.com/tape-testing/testling/compare/v1.5.6...v1.5.7) - 2013-12-27

### Commits

- Add nice message, .gitignore. [`9aa50c4`](https://github.com/tape-testing/testling/commit/9aa50c4bb45bc0fa78ea7aa5d828d8491a2b891a)
- no gitignore [`87dfbda`](https://github.com/tape-testing/testling/commit/87dfbda47e8f5740684928701579dd21dd0a0874)

## [v1.5.6](https://github.com/tape-testing/testling/compare/v1.5.5...v1.5.6) - 2013-12-22

### Commits

- allow the user to specify the test harness via argv [`4b6a27d`](https://github.com/tape-testing/testling/commit/4b6a27da249094e2d75c34ba4b86d8835fd02144)

## [v1.5.5](https://github.com/tape-testing/testling/compare/v1.5.3...v1.5.5) - 2013-12-10

### Commits

- code coverage example [`54e134d`](https://github.com/tape-testing/testling/commit/54e134dde358e3f5c4d027cca571335fdcb71f91)
- Use html5 doctype [`de8b9d9`](https://github.com/tape-testing/testling/commit/de8b9d9b4c0b6dacb3a10427c0bacb452b8573aa)
- Attempt to launch headless browser. [`209c5ae`](https://github.com/tape-testing/testling/commit/209c5aedfd6c0dab5cadb35785501d06578c72da)

## [v1.5.3](https://github.com/tape-testing/testling/compare/v1.5.2...v1.5.3) - 2013-10-11

### Commits

- Fix the --html option, when used in conjunction with "scripts". [`9c8c1c9`](https://github.com/tape-testing/testling/commit/9c8c1c987a7222879365e4c94258433ede786ef1)
- Fix the 'scripts' option in package.json's "testling" section. [`47d01f0`](https://github.com/tape-testing/testling/commit/47d01f08c12f503a9ec3b56fd50a7c1a27a9d0f8)

## [v1.5.2](https://github.com/tape-testing/testling/compare/v1.5.1...v1.5.2) - 2013-10-10

### Commits

- Fix the pkg.testling.html feature [`dacfc87`](https://github.com/tape-testing/testling/commit/dacfc87dbdf06abfcaa6e2637162abf5ddbe242b)

## [v1.5.1](https://github.com/tape-testing/testling/compare/v1.5.0...v1.5.1) - 2013-07-26

### Commits

- copy over the testling field info from testling-ci [`9e1f497`](https://github.com/tape-testing/testling/commit/9e1f497820929a4b47835d893306c4d1e434feed)
- section about the server field [`d515339`](https://github.com/tape-testing/testling/commit/d51533903e89d763d91839cd6c73c2155a489975)
- fix mocha by prefacing script paths with __testling [`b430365`](https://github.com/tape-testing/testling/commit/b430365085b599735c7f71dc74bdf1709ed08c47)

## [v1.5.0](https://github.com/tape-testing/testling/compare/v1.4.1...v1.5.0) - 2013-07-26

### Commits

- --show/--no-show, documented toggling console.log() output [`1ca55ef`](https://github.com/tape-testing/testling/commit/1ca55ef1b942a56bf52cc2f513693b7b04a29760)
- parse the query params [`100ef13`](https://github.com/tape-testing/testling/commit/100ef13af2cff347551c4c2f6f7a91f284b8960f)
- pipe output into a &lt;pre&gt; on the page [`5546d06`](https://github.com/tape-testing/testling/commit/5546d06984ef746cf26127451e2d7213a2fa804c)

## [v1.4.1](https://github.com/tape-testing/testling/compare/v1.4.0...v1.4.1) - 2013-07-26

### Commits

- finally works with websockets [`1389bf9`](https://github.com/tape-testing/testling/commit/1389bf9d8b99f81a7014ea5715c10a88bfe05f07)

## [v1.4.0](https://github.com/tape-testing/testling/compare/v1.3.3...v1.4.0) - 2013-07-26

### Commits

- use object-inspect in the prelude, expand %-args and use multi-arity console.log() params [`a35ff8c`](https://github.com/tape-testing/testling/commit/a35ff8c8b763b46fe809b5a36bf2608f9ba0ebc9)
- using bouncy in front of the pkg.testling.server param [`b4b866a`](https://github.com/tape-testing/testling/commit/b4b866a30b329dece61a851872dd5e2222531192)
- put the sock and html under __testling to make room for custom servers [`b9e08ea`](https://github.com/tape-testing/testling/commit/b9e08ea2bbaf1e849143eff0481455cd08fbdbb8)
- push the local browserify onto the /home/substack/prefix/bin:/home/substack/prefix/lib/gem/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games as a fallback if browserify isn't installed globally [`6b3d240`](https://github.com/tape-testing/testling/commit/6b3d24011d93fa8cc1d53ef7e366cb536cb3eab1)
- forward upgraded headers along without `connection: close` [`f5dc564`](https://github.com/tape-testing/testling/commit/f5dc564e28ce983b57263fc3e922b43b3eaf5be4)
- host static files until __testling too [`fda6c6c`](https://github.com/tape-testing/testling/commit/fda6c6c921d99c6946cbfad8c08892b47be2e7af)

## [v1.3.3](https://github.com/tape-testing/testling/compare/v1.3.2...v1.3.3) - 2013-07-23

### Commits

- better error message for -x without an argument [`c03d01b`](https://github.com/tape-testing/testling/commit/c03d01b0e723122cd951f71d02575fcc72f89db8)

## [v1.3.2](https://github.com/tape-testing/testling/compare/v1.3.1...v1.3.2) - 2013-07-23

### Commits

- -x in favor of --bcmd [`053e612`](https://github.com/tape-testing/testling/commit/053e6127a99147d5300b2c49877092560aca4586)
- -x to launch a custom browser command [`c6ac15f`](https://github.com/tape-testing/testling/commit/c6ac15f61268ba889f79165ac1d4c244b6dbd06a)
- fix bug with -u in non-tty mode [`586d8d1`](https://github.com/tape-testing/testling/commit/586d8d11b3525676c4e2753ea55ac240c0f19b71)

## [v1.3.1](https://github.com/tape-testing/testling/compare/v1.3.0...v1.3.1) - 2013-07-22

### Commits

- make sure there are files after unglobbing [`3da3dd9`](https://github.com/tape-testing/testling/commit/3da3dd9d9eb62453c2c1279614096a689f1ba57b)

## [v1.3.0](https://github.com/tape-testing/testling/compare/v1.2.2...v1.3.0) - 2013-07-21

### Commits

- --html [`6f5be86`](https://github.com/tape-testing/testling/commit/6f5be8618f2ae14b2c6f53367b7a43245079512f)

## [v1.2.2](https://github.com/tape-testing/testling/compare/v1.2.1...v1.2.2) - 2013-07-03

### Commits

- fixed testling.scripts [`7c7e054`](https://github.com/tape-testing/testling/commit/7c7e0543b104db0d31ad4f12b50a91fcfcedd53e)

## [v1.2.1](https://github.com/tape-testing/testling/compare/v1.2.0...v1.2.1) - 2013-06-24

### Commits

- why were these even checked into git [`e6ec958`](https://github.com/tape-testing/testling/commit/e6ec958fd6c1869a34e70d3056788e94c9cfc945)
- usage info in the docs [`c83c3b8`](https://github.com/tape-testing/testling/commit/c83c3b8f765b2ce09ff4b750ad1ad2606d780010)
- upgrade browser-launcher [`e35b140`](https://github.com/tape-testing/testling/commit/e35b1400f9e1a956e592dbd05fe55bfc02b35310)
- resolved, updated notes [`253333c`](https://github.com/tape-testing/testling/commit/253333c0bdcf1082d8b1f9ba651584c79d4f27aa)
- Document that it requires a global browserify copy to work [`06a1daf`](https://github.com/tape-testing/testling/commit/06a1daf8215590318e0df8265fa01910b1c360c2)

## [v1.2.0](https://github.com/tape-testing/testling/compare/v1.1.1...v1.2.0) - 2013-06-19

### Commits

- add scripts from the scripts field [`c0a2bb5`](https://github.com/tape-testing/testling/commit/c0a2bb5e5fd93ec16c42cc96601f9d8b6a57cfdd)
- fix for the html harness to insert the prelude [`3a95e20`](https://github.com/tape-testing/testling/commit/3a95e20f7723fa76365629c0087143819300495b)

## [v1.1.1](https://github.com/tape-testing/testling/compare/v1.1.0...v1.1.1) - 2013-06-19

### Commits

- no more temporary output files [`03d9056`](https://github.com/tape-testing/testling/commit/03d9056442c2d40b2cdafbc4f4772c2ce67c5ae4)

## [v1.1.0](https://github.com/tape-testing/testling/compare/v1.0.0...v1.1.0) - 2013-06-19

### Commits

- document the new `testling` use-case, remove old cruft [`5ab2bd1`](https://github.com/tape-testing/testling/commit/5ab2bd13b291cbcbd35c1223a0b7a04feabf9625)
- run browserify with unglobbing of testling.files [`acd317b`](https://github.com/tape-testing/testling/commit/acd317b2bd2a5cadbc2876e18f6d599dd7cc820a)
- custom browser command and url printing [`6a4ee9a`](https://github.com/tape-testing/testling/commit/6a4ee9a5f4e4c1e14088ebc224fe5de324a3bd76)
- package.json mode beginnings [`959f904`](https://github.com/tape-testing/testling/commit/959f904353612adfdc5dce1e7312e13b4bdfd7b7)
- usage info [`de3f94a`](https://github.com/tape-testing/testling/commit/de3f94a78ab4db35ff5d1a956cff9b3bfba52169)
- mocha harness works [`d57e03c`](https://github.com/tape-testing/testling/commit/d57e03cf95640d1d192278e55207772a64f6304c)
- check for pkg.testling [`fb5bae8`](https://github.com/tape-testing/testling/commit/fb5bae8d5b0424cbd9ae4a7bfc10fe72f9028c5c)
- prelude for `testling .` tests [`042fb1f`](https://github.com/tape-testing/testling/commit/042fb1f7229d09d48d0efd4105870a2de5e260a9)
- set pending properly [`bfbc562`](https://github.com/tape-testing/testling/commit/bfbc562a2805c03f2a90a8ea4ea85960c7061ea5)
- fix json [`b6a21e8`](https://github.com/tape-testing/testling/commit/b6a21e8ec280f538f174e89c6eb1c2f841894ff5)
- fix for - [`33cb905`](https://github.com/tape-testing/testling/commit/33cb905280095824add0c7de32e233bb91f7c41e)
- turn on debug mode [`6ccefc4`](https://github.com/tape-testing/testling/commit/6ccefc4f43b2be52b5fa0d35cea0a003dd2f5d11)

## [v1.0.0](https://github.com/tape-testing/testling/compare/v0.2.5...v1.0.0) - 2013-04-23

### Commits

- bundle browser-launcher to get the path.exists -&gt; fs.exists fix [`278fa78`](https://github.com/tape-testing/testling/commit/278fa7839cebd94e43165abdc9aa9408e8910a33)
- remove old stuff [`d476a5e`](https://github.com/tape-testing/testling/commit/d476a5e082445a2a3a73c357823cd64fa718699c)
- working pipable version [`08866f2`](https://github.com/tape-testing/testling/commit/08866f21575b8eb7248adddfff1634b2b423ec1f)
- forgot to check in cmd [`3f4e48c`](https://github.com/tape-testing/testling/commit/3f4e48cf5bde3968f9cc52a5d6aed1fe4844a9b6)
- update the readme to run local tests [`d542b27`](https://github.com/tape-testing/testling/commit/d542b27ff48229ebcc9a0d45fc96a51bfde45e83)
- update deps [`6887d00`](https://github.com/tape-testing/testling/commit/6887d00ec3964f8d6187f1bb1ccdec99c7da8340)
- fix path.exists [`ce34401`](https://github.com/tape-testing/testling/commit/ce34401bb9bc6dcd4365c31dcb55edf3846ba278)
- dev dep for the example [`06510d9`](https://github.com/tape-testing/testling/commit/06510d9dd13983d46e23fb76da30931c472a448c)

## [v0.2.5](https://github.com/tape-testing/testling/compare/v0.2.4...v0.2.5) - 2012-07-01

### Commits

- Expose the stream [`74453ef`](https://github.com/tape-testing/testling/commit/74453ef378a17cea881c18400389955b6fcfe273)

## [v0.2.4](https://github.com/tape-testing/testling/compare/v0.2.3...v0.2.4) - 2012-06-30

### Commits

- node harness with t.log() and stubbed out t.createWindow() [`0307525`](https://github.com/tape-testing/testling/commit/0307525a8716f15e07c80376d7866d77b2162e9f)

## [v0.2.3](https://github.com/tape-testing/testling/compare/v0.2.2...v0.2.3) - 2012-06-30

### Commits

- expose server objects [`e771044`](https://github.com/tape-testing/testling/commit/e771044892d9901125e342fcac370a5fcf84a4c3)
- default browser=node [`00dbd1b`](https://github.com/tape-testing/testling/commit/00dbd1b456c0c295ff3ca3e4bcc851a3b78eece4)
- exists order [`dbec17a`](https://github.com/tape-testing/testling/commit/dbec17aff50cc7da0741a7ee595921c9bffbc4cd)

## [v0.2.2](https://github.com/tape-testing/testling/compare/v0.2.1...v0.2.2) - 2012-06-30

### Commits

- fix missing deps [`fc9e4f1`](https://github.com/tape-testing/testling/commit/fc9e4f144d5c993a924ed0c7bfe000482c8502da)

## [v0.2.1](https://github.com/tape-testing/testling/compare/v0.2.0...v0.2.1) - 2012-06-30

### Commits

- document `testling list` [`a8dc74b`](https://github.com/tape-testing/testling/commit/a8dc74bc93e174ea57f6540311acc1c725b76a29)
- "list" command instead of --list [`1b7ddf9`](https://github.com/tape-testing/testling/commit/1b7ddf908512b6ae7a66aeba5746fc0adcbe423d)
- fix markdown [`e868748`](https://github.com/tape-testing/testling/commit/e868748ec08a8c9d98a7a382224e1f6d6a945c52)

## v0.2.0 - 2012-06-29

### Commits

- redux [`d5a9367`](https://github.com/tape-testing/testling/commit/d5a9367c2305d937b950b17a45c400ce20ad60af)
- factored out push() for pluggable output [`b125277`](https://github.com/tape-testing/testling/commit/b12527756362339be676794804ea6c4c29c33ea8)
- basic stub test works emitting json events [`6c78e60`](https://github.com/tape-testing/testling/commit/6c78e602f3b8d5893b71c7025e5d1c0edfac0781)
- list remote browsers in a new cli [`7b81b93`](https://github.com/tape-testing/testling/commit/7b81b9392a2e39688a8c29642f184f281456157d)
- basic json example now works [`649253a`](https://github.com/tape-testing/testling/commit/649253ac534c0e4a1b85d34737a7499f59855aac)
- account creation works [`f6f25e1`](https://github.com/tape-testing/testling/commit/f6f25e1a8aa2cb2ee9e64f87ab831c38821a5c84)
- render browser output back to the terminal [`11b72c1`](https://github.com/tape-testing/testling/commit/11b72c1e5b1b7f6139ea72702a76154edb81a458)
- catch errors in createWindow callbacks [`f689b08`](https://github.com/tape-testing/testling/commit/f689b081751230dedbeb0f6ec7f562c94fe97055)
- beginnings of user auth verification [`fe3dc93`](https://github.com/tape-testing/testling/commit/fe3dc9399691709b75bdbb17d5c0494e34ac4609)
- injection proxy works [`df888ca`](https://github.com/tape-testing/testling/commit/df888cac802be8719959eee48132c0b205de34c4)
- split up server creating code into lib/servers, stubbed out tunnels [`a974a94`](https://github.com/tape-testing/testling/commit/a974a94620b7f748a657997cd64692c086b7f360)
- shim out testling visitor [`e047391`](https://github.com/tape-testing/testling/commit/e0473910fb97d5f521c9b63be3006350d849b888)
- submitForm now works [`1441297`](https://github.com/tape-testing/testling/commit/14412971ef34897f4294025b0763de3a18778cdf)
- fix option for headless and kill [`5097134`](https://github.com/tape-testing/testling/commit/50971346b313c716cbdc491d5fadd60d615cfae6)
- t.log and t.createWindow work [`9f938e0`](https://github.com/tape-testing/testling/commit/9f938e039192e04cf11b06ec648012e0ef362880)
- integrated tunnels [`0007c18`](https://github.com/tape-testing/testling/commit/0007c18f0198a8b450f4de21f1184a31487c8139)
- getting json output with tap harness in the browser [`1583149`](https://github.com/tape-testing/testling/commit/1583149b413f8f4e36a80019d3c158276efeca8f)
- stack traces with truncated output [`f287e0d`](https://github.com/tape-testing/testling/commit/f287e0dd9b86242a1b012a4d838e5eca49d9bfa4)
- testling auth/visit [`f6f4b35`](https://github.com/tape-testing/testling/commit/f6f4b355e9b7253621e7755607b9dc8ed4c3f523)
- factored out createWindow() logic, broke submitForm() somehow [`04c8aae`](https://github.com/tape-testing/testling/commit/04c8aae77f09eebf99eaa757f0bf8ebe1ee57a54)
- tunnels and remote testling browsers work! [`6d84224`](https://github.com/tape-testing/testling/commit/6d8422412e7f1384d0915494913488303d34753d)
- documented usage [`1b1e241`](https://github.com/tape-testing/testling/commit/1b1e24163a8c19e3b1d0dfe804b1d8247d7a206e)
- submitForm() works again with refactored createWindow() [`bf693b2`](https://github.com/tape-testing/testling/commit/bf693b23933ec23c0b0f6601656aca3881600afb)
- now integrated with browser-launcher [`2fc0f0e`](https://github.com/tape-testing/testling/commit/2fc0f0eb94c9c5ddc8ac660e85df030f36c4f94d)
- updated the docs [`a2d2de6`](https://github.com/tape-testing/testling/commit/a2d2de6c0d4b07d41ab458db852453cebbd274dc)
- launch the browser automatically and headlessly [`5dadf39`](https://github.com/tape-testing/testling/commit/5dadf3932d7464ddaa62565e4fb280897ac7ab5e)
- get a list of the remote browsers [`be64c3f`](https://github.com/tape-testing/testling/commit/be64c3fbadeb6375829c774330e99f0bd1de844a)
- list local [`12143d4`](https://github.com/tape-testing/testling/commit/12143d49cea2a03a10dba1c1aefd52e95d122175)
- now with jquery [`a6de2c8`](https://github.com/tape-testing/testling/commit/a6de2c86d35d10986edc305c72cf5b8c8e175756)
- fix for output race condition [`cdf7efb`](https://github.com/tape-testing/testling/commit/cdf7efb9b8e55545aaf35de0be16fe609f79a020)
- and a package.json [`b035ba3`](https://github.com/tape-testing/testling/commit/b035ba37cc1d9c0245c52ffa4a2a95e1cc9ac07c)
- render the bundle inline instead of relying on static/, now works with test file arguments [`4a636db`](https://github.com/tape-testing/testling/commit/4a636db23e720605830444a59a54dc45f23e0038)
- example interaction [`7002aef`](https://github.com/tape-testing/testling/commit/7002aef1d2c53a892870546b4a662d4510403bef)
- testling params [`8f1ee27`](https://github.com/tape-testing/testling/commit/8f1ee270c0d42501ec04024787649bfd466d04ff)
- pipe tap to the console [`cc268b3`](https://github.com/tape-testing/testling/commit/cc268b319deb4e34e7788e695a5df69b5c11ca82)
- jsdom randomly won't set the title, whatever [`8c4a654`](https://github.com/tape-testing/testling/commit/8c4a654fcbf2aae0b81ac5c4e34353747d65f4c8)
- problems with jsdom [`d9b92ff`](https://github.com/tape-testing/testling/commit/d9b92ff080ad095ce4098cb4604a78e1446bf8d9)
- better error reporting, use my jsdom with the default console.log() taken out [`abcd0b3`](https://github.com/tape-testing/testling/commit/abcd0b3082a8a88ff47f5e3d5aa33dc630ae80d0)
- /visit stuff works with local testling-server [`1788953`](https://github.com/tape-testing/testling/commit/17889531775e08d5ab65681830bb4c3799b1920b)
- update example for schoolbus, delete lib/launcher.js [`1adc4b4`](https://github.com/tape-testing/testling/commit/1adc4b417f11e3b65f4d0173e55ea225cf4a1d0e)
- forgot to add the producer [`9d57cd8`](https://github.com/tape-testing/testling/commit/9d57cd86af5d0976550068f6827a1bf84fbf388c)
- --browsers now works with accounts! [`d1206ec`](https://github.com/tape-testing/testling/commit/d1206ecfd0edad623e22f1ba4439cf7fd5b9bb3e)
- support --main and symlinks [`d4707f9`](https://github.com/tape-testing/testling/commit/d4707f9c3109c01fd8ad82d74b94cfef3a2c56d5)
- handle logs [`b372b6a`](https://github.com/tape-testing/testling/commit/b372b6a48f40a0d269b4610610aefa3a0dcd9d67)
- basic thing works for node [`0b7050b`](https://github.com/tape-testing/testling/commit/0b7050b15f0d08a5638910278ea9ef1aba799dc9)
- show source snippets from the failing assertions [`51163d0`](https://github.com/tape-testing/testling/commit/51163d037deb0523f2146e38a9ff4a3e309c4dfd)
- briefly document the api [`4dec110`](https://github.com/tape-testing/testling/commit/4dec110374cbc72aabd54a722d2c27668d6c3246)
- echo browser [`7f3dbe9`](https://github.com/tape-testing/testling/commit/7f3dbe9fa6f3fc8960a926d534b6e33a42a2cb87)
- auth works but doesn't tunnel [`e01c5d3`](https://github.com/tape-testing/testling/commit/e01c5d345b328b4c2c738e05a73e89d87cf10241)
- fix logs and close the document [`4645525`](https://github.com/tape-testing/testling/commit/46455255495aed3925513dfc6aaa1f7116fa6ad1)
- remote testling browsers work! [`542d68c`](https://github.com/tape-testing/testling/commit/542d68cc381517808275f42fe2b1dbd55618fec9)
- remove horizontal whitespace [`e12417b`](https://github.com/tape-testing/testling/commit/e12417b288871e9196e8aa7d2d51c4dcc60efb3d)
- installation note [`b0998e5`](https://github.com/tape-testing/testling/commit/b0998e5c82b1792b81bdc41fc9db18e2b14462e6)
- readme stub [`1cc80b7`](https://github.com/tape-testing/testling/commit/1cc80b72167c5145ba831278c29a656eceff6267)
- move the makefile into the scripts.install [`1d4de7b`](https://github.com/tape-testing/testling/commit/1d4de7b37641c3b5854d98d843ea8f42cfe68798)
- fix to set the window title [`44867f3`](https://github.com/tape-testing/testling/commit/44867f33930707356a090700f02f92fa3fae19a7)
- log lines with &gt;&gt; [`798b5c9`](https://github.com/tape-testing/testling/commit/798b5c935d74e70463ca3cb50a2e28c4ee019f82)
- fixed the form example by adding stub content [`27fbc14`](https://github.com/tape-testing/testling/commit/27fbc141ca9ccd783e1c8d71a50b249ee4249159)
- turn on kill for headless mode, remove kill arg [`43a866c`](https://github.com/tape-testing/testling/commit/43a866c2c240a0882c07d9a92134e1dfb57ad50d)
- using noProxy, now works with firefox [`5c8c2fc`](https://github.com/tape-testing/testling/commit/5c8c2fc345eb121e52d2ab3756e1bc6b4a63babd)
- pix [`a6dfefa`](https://github.com/tape-testing/testling/commit/a6dfefa82b913223e430dc0e179b1f5662f432ff)
