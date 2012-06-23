all:
	node_modules/.bin/browserify example/form.js -o static/bundle.js

static/proxy.js:
	node_modules/.bin/browserify node_modules/schoolbus/proxy.js -o static/proxy.js

proxy: static/proxy.js

