/* eslint-env mocha */
/* eslint-env browser */
import assert from 'assert';

import { TextureAtlas } from '.';
import TextureAtlasJsonDef from './TextureAtlasJsonDef';

describe('TextureAtlasJsonDef', () => {
  describe('new TextureAtlasJsonDef(jsonDef)', () => {
    let jsonDef;

    before((done) => {
      window.fetch(('/assets/nobinger.json'))
        .then(response => response.json())
        .then((json) => {
          jsonDef = new TextureAtlasJsonDef(json);
          done();
        });
    });

    it('jsonDef', () => {
      assert.ok(jsonDef.jsonDef);
    });

    it('frameNames', () => assert.deepEqual(jsonDef.frameNames, [
      'nobinger-blau.png',
      'nobinger-gold.png',
      'nobinger-grau.png',
      'nobinger-gruen.png',
      'nobinger-lila.png',
      'nobinger-rot.png',
    ]));
  });

  describe('TextureAtlas.load', () => {
    let atlas;

    before((done) => {
      TextureAtlas.load('/assets/nobinger.json').then((textureAtlas) => {
        atlas = textureAtlas;
        done();
      });
    });

    it('jsonDef.meta.format', () => assert.equal(atlas.jsonDef.meta.format, 'RGBA8888'));

    it('root texture', () => {
      const tex = atlas.rootTexture;
      assert.ok(tex);
      assert.equal(tex.root, tex);
      assert.equal(tex.width, 128);
      assert.equal(tex.height, 256);
    });

    it('frame: nobinger-blau.png', () => {
      const tex = atlas.frame('nobinger-blau.png');
      assert.ok(tex);
      assert(tex.root !== tex);
      assert.equal(tex.width, 55);
      assert.equal(tex.height, 61);
    });

    it('add frame alias', () => {
      atlas.addFrameAlias('blau', 'nobinger-blau.png');
      assert.equal(atlas.frame('blau'), atlas.frame('nobinger-blau.png'));
      assert.deepEqual(atlas.frameNames().sort(), [
        'nobinger-blau.png',
        'nobinger-gold.png',
        'nobinger-grau.png',
        'nobinger-gruen.png',
        'nobinger-lila.png',
        'nobinger-rot.png',
        'blau',
      ].sort());
    });

    it('frameNames sequence', () => {
      assert.deepEqual(atlas.frameNames('(blau|gold)').sort(), [
        'nobinger-blau.png',
        'nobinger-gold.png',
        'blau',
      ].sort());
    });
  });
});
