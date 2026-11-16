export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'style', 'refactor', 'chore', 'docs', 'test']],
    'header-max-length': [2, 'always', 72],
    // Scopes from conventions §4.3; a warning, not a block
    'scope-enum': [
      1,
      'always',
      [
        'nav',
        'hero',
        'about',
        'services',
        'contact',
        'footer',
        'content',
        'router',
        'layout',
        'laro',
        'sipa',
        'leaderboard',
        'api',
        'db',
        'config',
        'ci',
        'release',
      ],
    ],
  },
}
