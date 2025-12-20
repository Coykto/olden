"""
Database router for separating game data from user data.

- gamedata app → 'gamedata' database (read-only, tracked in git)
- Everything else → 'default' database (user data, not tracked)
"""


class GameDataRouter:
    """
    Routes database operations for the gamedata app to the 'gamedata' database.
    All other apps use the 'default' database.
    """

    gamedata_apps = {'gamedata'}

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.gamedata_apps:
            return 'gamedata'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.gamedata_apps:
            return 'gamedata'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations within the same database
        db1 = 'gamedata' if obj1._meta.app_label in self.gamedata_apps else 'default'
        db2 = 'gamedata' if obj2._meta.app_label in self.gamedata_apps else 'default'
        return db1 == db2

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in self.gamedata_apps:
            return db == 'gamedata'
        return db == 'default'
