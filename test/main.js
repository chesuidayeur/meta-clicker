QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

/* Resource testing */
QUnit.test("Resource testing", function(assert) {
  var res = new Resource('cookies', 'Best developer fuel ever', '.resources');

  assert.equal(res.toString(), 'cookies : 0');

  assert.equal(res.getRawValue(), 0);
  assert.equal(res.getValue(), 0);

  res.add(3);

  assert.equal(res.getRawValue(), 3);
  assert.equal(res.getValue(), 3);

  res.add(3.1415926);

  assert.equal(res.getRawValue(), 6.1415926);
  assert.equal(res.getValue(), 6.142);

  res.consume(2);

  assert.equal(res.getRawValue(), 4.1415926);
  assert.equal(res.getValue(), 4.142);

  res.display();
  assert.equal($("#qunit-fixture div.resources div#cookies").length, 1);
  assert.equal($("#qunit-fixture div.resources div#cookies span.value").html(), "4.142");

  res.displayed = false;
  $("#qunit-fixture div.resources div#cookies").remove();
  res.render();
  assert.equal($("#qunit-fixture div.resources div#cookies").length, 1);
  assert.equal($("#qunit-fixture div.resources div#cookies span.value").html(), "4.142");

  res.add(1);
  res.render();
  assert.equal($("#qunit-fixture div.resources div#cookies span.value").html(), "5.142");
});
