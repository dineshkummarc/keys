
SRC = lib/keys.js \
	  lib/stores/memory.js \
	  lib/stores/nstore.js \
	  lib/stores/redis.js

TESTS = test/*.test.js

index.html: $(SRC)
	dox $(SRC) \
		--title "Keys" \
		--desc "Unified interface for key/value store clients written for [node](http://nodejs.org)." \
		--ribbon "http://github.com/visionmedia/keys" \
		> index.html

test:
	@./support/expresso/bin/expresso $(TEST_FLAGS) \
		-I lib \
		-I support/nstore/lib \
		-I support/microdb/lib \
		-I support/redis/lib \
		$(TESTS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov

.PHONY: test test-cov