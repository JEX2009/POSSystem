import os
import binascii
from django.db import models
from django.utils.translation import gettext_lazy as _
# Importamos el modelo Usuario desde el archivo de modelos de la misma app
from .models import Usuario 

class AuthToken(models.Model):
    """
    Modelo de Token personalizado que se enlaza a nuestro modelo 'Usuario'.
    """
    # El 'key' es la cadena de texto del token
    key = models.CharField(_("Key"), max_length=40, primary_key=True)
    
    # CAMBIO CLAVE: La relación apunta directamente a nuestro modelo 'Usuario'
    user = models.OneToOneField(
        Usuario, 
        related_name='auth_token',
        on_delete=models.CASCADE,
        verbose_name=_("Usuario")
    )
    
    created = models.DateTimeField(_("Created"), auto_now_add=True)

    class Meta:
        # Le damos un nombre claro en el panel de administración
        verbose_name = _("Auth Token")
        verbose_name_plural = _("Auth Tokens")

    def save(self, *args, **kwargs):
        # Si el token no tiene una clave, la generamos antes de guardar.
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

    def generate_key(self):
        # CAMBIO CLAVE: Esta es la implementación real para generar una clave segura
        return binascii.hexlify(os.urandom(20)).decode()

    def __str__(self):
        return self.key
    
    
    