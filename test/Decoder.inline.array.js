var assert = require('assert');
var assertNeon = require('../src/assert');
var neon = require('../src/neon');
suite('Decoder.inline.array', function () {
	test('{"foo": "bar"}', function () {
		assertNeon.equal(neon.decode('{"foo":"bar"}'), {
			foo: "bar"
		});
	});
	test('true, false, null constants', function () {
		assertNeon.equal(neon.decode('[true, tRuE, TRUE, false, FALSE, yes, YES, no, NO, null, NULL,]'), {
			0: true, 1: 'tRuE', 2: true, 3: false, 4: false, 5: true, 6: true, 7: false, 8: false, 9: null, 10: null
		})
	});
	test('on, off, false, numbers', function () {
		assertNeon.equal(neon.decode('{false: off, "on": true, -5: 1, 5.3: 1}'), {
			"false": false,
			"on": true,
			"-5": 1,
			"5.3": 1
		});
	});

	test('long inline', function () {
		assertNeon.equal(neon.decode('{a, b, {c: d}, e: f, g:,h:}'), {
			0: "a",
			1: "b",
			2: {c: "d"},
			e: "f",
			g: null,
			h: null
		})
	});

	test('5', function () {
		assertNeon.equal(neon.decode("{a,\nb\nc: 1,\nd: 1,\n\ne: 1\nf:\n}"), {
			0: "a",
			1: "b",
			c: 1,
			d: 1,
			e: 1,
			f: null
		});
	});
	test('entity 1', function () {
		assert.ok(neon.decode("@item(a, b)") instanceof neon.Entity);
	});
	test('entity 2', function () {
		assertNeon.equal(neon.decode("@item(a, b)"), new neon.Entity("@item", {0: "a", 1: "b"}));
	});
	test('entity 3', function () {
		assertNeon.equal(neon.decode("@item<item>(a, b)"), new neon.Entity("@item<item>", {0: "a", 1: "b"}));
	});
	test('entity 4', function () {
		assertNeon.equal(neon.decode("@item (a, b)"), new neon.Entity("@item", {0: "a", 1: "b"}));
	});
	test('entity 5', function () {
		assertNeon.equal(neon.decode("[]()"), new neon.Entity({}, {}));
	});
	test('entity 6', function () {
		assertNeon.equal(neon.decode("first(a, b)second"), new neon.Entity(neon.CHAIN, {
			0: new neon.Entity("first", {0: "a", 1: "b"}),
			1: new neon.Entity("second")
		}));
	});
	test('entity 7', function () {
		assertNeon.equal(neon.decode("first(a, b)second(1,2)"), new neon.Entity(neon.CHAIN, {
			0: new neon.Entity("first", {0: "a", 1: "b"}),
			1: new neon.Entity("second", {0: 1, 1: 2})
		}));
	});
	test('entity 8', function () {
		assertNeon.equal(neon.decode("first(a, b)second(1,2)third(x: foo, y=bar)"), new neon.Entity(neon.CHAIN, {
			0: new neon.Entity("first", {0: "a", 1: "b"}),
			1: new neon.Entity("second", {0: 1, 1: 2}),
			2: new neon.Entity("third", {x: "foo", y: "bar"})
		}));
	});
});
