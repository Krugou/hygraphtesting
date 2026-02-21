import { createAndPublishTranslation } from '../scripts/mutations';

describe('Translation Mutations', () => {
  it('should create and publish a translation', async () => {
    const translationId = `test-${Date.now()}`;
    const description = 'Test translation';
    const translation = 'Hello world';
    const { createData, publishData } = await createAndPublishTranslation(
      translationId,
      description,
      translation,
    );
    expect(createData.createTranslation.id).toBeDefined();
    expect(publishData.publishTranslation.id).toBe(createData.createTranslation.id);
    expect(publishData.publishTranslation.stage).toBe('PUBLISHED');
  });
});
