import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  access: allow => ({
    'admin/*': [
      allow.authenticated().to(['read', 'write', 'delete'])
    ],
    'official/*': [
      allow.public().to(['read']),
      allow.authenticated().to(['write', 'delete'])
    ],
    'shared/{entity_id}/*': [
      allow.public().to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'versions/*': [
      allow.public().to(['read']),
      allow.authenticated().to(['write', 'delete'])
    ]
  })
});