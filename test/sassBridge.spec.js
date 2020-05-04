import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import sassBridge from '../src/sassBridge'
import sass from 'sass'

chai.use(sinonChai)

describe('sassBridge', function() {
  context('when it is called', function() {
    let args

    beforeEach(function() {
      args = {
        foo: sinon.spy(),
        bar: sinon.spy(),
      }
    })

    it('should only accept an object with functions as values as an argument', function() {
      const
        badObjectArgs = { foo: 'string' },
        badTypeArgs = 'string'

      expect(() => sassBridge(args)).not.to.throw
      expect(() => sassBridge(badObjectArgs)).to.throw(/InvalidArgument/)
      expect(() => sassBridge(badTypeArgs)).to.throw(/InvalidArgument/)
    })

    it('should return an object with functions as values', function() {
      expect(sassBridge(args)).to.have.property('foo')
      expect(sassBridge(args)).to.have.property('bar')
      expect(sassBridge(args).foo).to.be.a('function')
      expect(sassBridge(args).bar).to.be.a('function')
    })
  })

  context('when a wrapper function is called', function() {
    let
      wrapperFunction,
      originalFunction

    beforeEach(function() {
      originalFunction = sinon.stub()
      wrapperFunction = sassBridge({
        fn: originalFunction,
      }).fn
    })

    context('when the original function is called', function() {
      it('should receive a boolean', function() {
        const sassBoolean = sass.types.Boolean.TRUE

        wrapperFunction(sassBoolean)

        expect(originalFunction).to.have.been.calledWith(true)
      })

      it('should receive a null', function() {
        const sassNull = sass.types.Null.NULL

        wrapperFunction(sassNull)

        expect(originalFunction).to.have.been.calledWith(null)
      })

      it('should receive a json representation of a dimension', function() {
        const sassNumber = new sass.types.Number(10, 'px')

        wrapperFunction(sassNumber)

        expect(originalFunction).to.have.been.calledWith({ denominatorUnits: [], numeratorUnits: ["px"], value: 10 })
      })

      it('should receive a string', function() {
        const sassString = new sass.types.String('striiing')

        wrapperFunction(sassString)

        expect(originalFunction).to.have.been.calledWith('striiing')
      })

      it('should receive a json representation of a color', function() {
        const sassColor = new sass.types.Color(255, 255, 255, 0.5)

        wrapperFunction(sassColor)

        expect(originalFunction).to.have.been.calledWith({
          R: 255,
          G: 255,
          B: 255,
          A: 0.5
        })
      })

      it('should receive an array', function() {
        const sassList = new sass.types.List(3)
        sassList.setValue(0, new sass.types.Number(10, 'px'))
        sassList.setValue(1, new sass.types.String('striiing'))
        sassList.setValue(2, sass.types.Boolean.TRUE)

        wrapperFunction(sassList)

        expect(originalFunction).to.have.been.calledWith(
          sinon.match.array.deepEquals(
            [{ denominatorUnits: [], numeratorUnits: ["px"], value: 10 }, 'striiing', true]
          )
        )
      })

      it('should receive a map-like object', function() {
        const sassMap = new sass.types.Map(1)
        sassMap.setKey(0, new sass.types.String('key'))
        sassMap.setValue(0, new sass.types.String('striiing'))

        wrapperFunction(sassMap)

        const call = originalFunction.getCall(-1)
        const mapLike = call.args[0]
        expect(mapLike.get('key')).to.eql('striiing')

        mapLike.set('foo', 'bar')
        expect(mapLike.get('foo')).to.eql('bar')
      })
    })

    context('when the original function returns a value', function() {
      it('should be cast to a Sass boolean', function() {
        originalFunction.returns(true)
        expect(wrapperFunction()).to.eql(sass.types.Boolean.TRUE)
      })

      it('should be cast to a Sass null', function() {
        originalFunction.returns(null)
        expect(wrapperFunction()).to.eql(sass.types.Null.NULL)
      })

      it('should be cast to a Sass number', function() {
        originalFunction.returns({ denominatorUnits: [], numeratorUnits: ["px"], value: 10 })

        expect(wrapperFunction()).to.eql(new sass.types.Number(10, 'px'))
      })

      it('should be cast to a Sass string', function() {
        originalFunction.returns('striiing')

        expect(wrapperFunction()).to.eql(new sass.types.String('striiing'))
      })

      it('should be cast to a Sass color', function() {
        originalFunction.returns({
          R: 255,
          G: 255,
          B: 255,
          A: 0.5
        })

        expect(wrapperFunction()).to.eql(new sass.types.Color(255, 255, 255, 0.5))
      })

      it('should be cast to a Sass array', function() {
        originalFunction.returns([1, 'two', true])


        const sassList = new sass.types.List(3)
        sassList.setValue(0, new sass.types.Number(1))
        sassList.setValue(1, new sass.types.String('two'))
        sassList.setValue(2, sass.types.Boolean.TRUE)

        expect(wrapperFunction()).to.eql(sassList)
      })

      it('should be cast to a Sass map', function() {
        originalFunction.returns({ key: 'striiing' })

        expect(wrapperFunction().getLength()).to.eql(1)
        expect(wrapperFunction().getKey(0).getValue()).to.eql('key')
        expect(wrapperFunction().getValue(0).getValue()).to.eql('striiing')
      })
    })
  })
})