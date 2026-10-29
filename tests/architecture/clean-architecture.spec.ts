import { describe, it, expect } from 'vitest';
import { filesOfProject } from 'tsarch';

describe('Validação de Clean Architecture e Isolamento de Camadas', () => {
  it('a camada domain não deve depender da camada application', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('application');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('a camada domain não deve depender da camada infrastructure', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('infrastructure');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('a camada domain não deve depender da camada api', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('api');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('a camada application não deve depender da camada infrastructure', async () => {
    const rule = filesOfProject()
      .inFolder('application')
      .shouldNot()
      .dependOnFiles()
      .inFolder('infrastructure');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('a camada application não deve depender da camada api', async () => {
    const rule = filesOfProject()
      .inFolder('application')
      .shouldNot()
      .dependOnFiles()
      .inFolder('api');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('a camada infrastructure não deve depender da camada api', async () => {
    const rule = filesOfProject()
      .inFolder('infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('api');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('o projeto não deve possuir dependências circulares entre os módulos', async () => {
    const rule = filesOfProject()
      .inFolder('src')
      .should()
      .beFreeOfCycles();

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });
});
