/* eslint-env mocha */
/* eslint-env browser */
import { expect } from 'chai';
import { Projection } from '.';

describe('Projection', () => {
  describe('pixelRatio', () => {
    it('pixelRatio=1, devicePixelRatio=1', () => {
      const proj = new Projection({ pixelRatio: 1, devicePixelRatio: 1 });
      proj.update(5000, 2000);
      expect(proj.width).to.equal(5000);
      expect(proj.height).to.equal(2000);
      expect(proj.pixelRatio).to.equal(1);
    });
    it('pixelRatio=2, devicePixelRatio=1', () => {
      const proj = new Projection({ pixelRatio: 2, devicePixelRatio: 1 });
      proj.update(5000, 2000);
      expect(proj.width).to.equal(2500);
      expect(proj.height).to.equal(1000);
      expect(proj.pixelRatio).to.equal(2);
    });
    it('pixelRatio=1, devicePixelRatio=2', () => {
      const proj = new Projection({ pixelRatio: 1, devicePixelRatio: 2 });
      proj.update(5000, 2000);
      expect(proj.width).to.equal(2500);
      expect(proj.height).to.equal(1000);
      expect(proj.pixelRatio).to.equal(2);
    });
    it('pixelRatio=2, devicePixelRatio=2', () => {
      const proj = new Projection({ pixelRatio: 2, devicePixelRatio: 2 });
      proj.update(5000, 2000);
      expect(proj.width).to.equal(1250);
      expect(proj.height).to.equal(500);
      expect(proj.pixelRatio).to.equal(4);
    });
  });
  describe('fill', () => {
    it('landscape view', () => {
      const proj = new Projection({ fit: 'fill', width: 666, height: 999 });
      proj.update(5000, 2000);
      expect(proj.width).to.equal(666);
      expect(proj.height).to.equal(999);
    });
    it('portrait view', () => {
      const proj = new Projection({ fit: 'fill', width: 888, height: 777 });
      proj.update(3000, 1000);
      expect(proj.width).to.equal(888);
      expect(proj.height).to.equal(777);
    });
    it('quadric view', () => {
      const proj = new Projection({ fit: 'fill', width: 444, height: 333 });
      proj.update(1000, 1000);
      expect(proj.width).to.equal(444);
      expect(proj.height).to.equal(333);
    });
  });

  describe('contain', () => {
    describe('landscape view', () => {
      describe('landscape layout', () => {
        it('view ratio < desired ratio', () => {
          const proj = new Projection({ fit: 'contain', width: 1000, height: 600 }); // 0.6
          proj.update(4000, 2000); // 0.5
          expect(proj.width).to.be.above(1000);
          expect(proj.height).to.equal(600);
        });
      });
      describe('landscape layout', () => {
        it('view ratio > desired ratio', () => {
          const proj = new Projection({ fit: 'contain', width: 400, height: 120 }); // 0.3
          proj.update(4000, 2000);
          expect(proj.width).to.equal(400);
          expect(proj.height).to.be.above(120);
        });
      });
      it('portrait layout', () => {
        const proj = new Projection({ fit: 'contain', width: 600, height: 1000 });
        proj.update(4000, 2000);
        expect(proj.width).to.be.above(600);
        expect(proj.height).to.equal(1000);
      });
      it('quadric layout', () => {
        const proj = new Projection({ fit: 'contain', width: 800, height: 800 });
        proj.update(4000, 2000);
        expect(proj.width).to.be.above(800);
        expect(proj.height).to.equal(800);
      });
    });
    describe('portrait view', () => {
      describe('portrait layout', () => {
        it('view ratio > desired ratio', () => {
          const proj = new Projection({ fit: 'contain', width: 600, height: 1000 }); // 1.66
          proj.update(2000, 4000); // 2
          expect(proj.width).to.equal(600);
          expect(proj.height).to.be.above(1000);
        });
      });
      describe('portrait layout', () => {
        it('view ratio < desired ratio', () => {
          const proj = new Projection({ fit: 'contain', width: 120, height: 400 }); // 3.33
          proj.update(2000, 4000);
          expect(proj.width).to.be.above(120);
          expect(proj.height).to.equal(400);
        });
      });
      it('landscape layout', () => {
        const proj = new Projection({ fit: 'contain', width: 1000, height: 600 });
        proj.update(2000, 4000);
        expect(proj.width).to.equal(1000);
        expect(proj.height).to.be.above(600);
      });
      it('quadric layout', () => {
        const proj = new Projection({ fit: 'contain', width: 800, height: 800 });
        proj.update(2000, 4000);
        expect(proj.width).to.equal(800);
        expect(proj.height).to.be.above(800);
      });
    });
    describe('quadric view', () => {
      it('landscape layout', () => {
        const proj = new Projection({ fit: 'contain', width: 1000, height: 600 }); // 0.6 landscape
        proj.update(4000, 4000); // 1
        expect(proj.width).to.be.equal(1000);
        expect(proj.height).to.above(600);
      });
      it('portrait layout', () => {
        const proj = new Projection({ fit: 'contain', width: 600, height: 1000 }); // 1.667 portrait
        proj.update(4000, 4000);
        expect(proj.width).to.be.above(600);
        expect(proj.height).to.equal(1000);
      });
      it('quadric layout', () => {
        const proj = new Projection({ fit: 'contain', width: 800, height: 800 }); // 1 quadric
        proj.update(4000, 4000);
        expect(proj.width).to.be.equal(800);
        expect(proj.height).to.equal(800);
      });
    });
  });

  describe('cover', () => {
    describe('landscape view', () => {
      describe('landscape layout', () => {
        it('view ratio < desired ratio', () => {
          const proj = new Projection({ fit: 'cover', width: 1000, height: 600 }); // 0.6
          proj.update(4000, 2000); // 0.5
          expect(proj.width).to.equal(1000);
          expect(proj.height).to.be.below(600);
        });
      });
      describe('landscape layout', () => {
        it('view ratio > desired ratio', () => {
          const proj = new Projection({ fit: 'cover', width: 400, height: 120 }); // 0.3
          proj.update(4000, 2000);
          expect(proj.width).to.be.below(400);
          expect(proj.height).to.equal(120);
        });
      });
      it('portrait layout', () => {
        const proj = new Projection({ fit: 'cover', width: 600, height: 1000 });
        proj.update(4000, 2000);
        expect(proj.width).to.equal(600);
        expect(proj.height).to.be.below(1000);
      });
      it('quadric layout', () => {
        const proj = new Projection({ fit: 'cover', width: 800, height: 800 });
        proj.update(4000, 2000);
        expect(proj.width).to.equal(800);
        expect(proj.height).to.be.below(800);
      });
    });
    describe('portrait view', () => {
      describe('portrait layout', () => {
        it('view ratio > desired ratio', () => {
          const proj = new Projection({ fit: 'cover', width: 600, height: 1000 }); // 1.66
          proj.update(2000, 4000); // 2
          expect(proj.width).to.be.below(600);
          expect(proj.height).to.equal(1000);
        });
      });
      describe('portrait layout', () => {
        it('view ratio < desired ratio', () => {
          const proj = new Projection({ fit: 'cover', width: 120, height: 400 }); // 3.33
          proj.update(2000, 4000);
          expect(proj.width).to.equal(120);
          expect(proj.height).to.be.below(400);
        });
      });
      it('landscape layout', () => {
        const proj = new Projection({ fit: 'cover', width: 1000, height: 600 });
        proj.update(2000, 4000);
        expect(proj.width).to.be.below(1000);
        expect(proj.height).to.equal(600);
      });
      it('quadric layout', () => {
        const proj = new Projection({ fit: 'cover', width: 800, height: 800 });
        proj.update(2000, 4000);
        expect(proj.width).to.be.below(800);
        expect(proj.height).to.equal(800);
      });
    });
    describe('quadric view', () => {
      it('landscape layout', () => {
        const proj = new Projection({ fit: 'cover', width: 1000, height: 600 }); // 0.6 landscape
        proj.update(4000, 4000); // 1
        expect(proj.width).to.be.below(1000);
        expect(proj.height).to.equal(600);
      });
      it('portrait layout', () => {
        const proj = new Projection({ fit: 'cover', width: 600, height: 1000 }); // 1.667 portrait
        proj.update(4000, 4000);
        expect(proj.width).to.be.equal(600);
        expect(proj.height).to.below(1000);
      });
      it('quadric layout', () => {
        const proj = new Projection({ fit: 'cover', width: 800, height: 800 }); // 1 quadric
        proj.update(4000, 4000);
        expect(proj.width).to.be.equal(800);
        expect(proj.height).to.equal(800);
      });
    });
  });
});
