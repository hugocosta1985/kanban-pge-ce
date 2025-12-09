import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LogService } from '../services/log.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const logService = inject(LogService);

  const authReq = req.clone({
    setHeaders: { 'X-API-Key': 'simulacao-pge-ceara-token' },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      logService.error(`API Error [${error.status}]: ${req.url}`, error);

      let userMessage =
        'Ocorreu um erro inesperado. Tente novamente mais tarde.';
      let summary = 'Erro no Sistema';

      if (error.error && error.error.message) {
        userMessage = error.error.message;
      }

      switch (error.status) {
        case 400:
          summary = 'Dados Inválidos';
          if (!error.error?.message)
            userMessage = 'Verifique os dados enviados.';
          break;
        case 401:
          summary = 'Acesso Negado';
          userMessage = 'Sua sessão expirou. Faça login novamente.';
          break;
        case 403:
          summary = 'Proibido';
          userMessage = 'Você não tem permissão para realizar esta ação.';
          break;
        case 404:
          summary = 'Não Encontrado';
          userMessage = 'O recurso solicitado não existe.';
          break;
        case 500:
          summary = 'Erro no Servidor';
          userMessage =
            'Nossos servidores estão instáveis. Tente em instantes.';
          break;
        case 0:
          summary = 'Sem Conexão';
          userMessage = 'Verifique sua internet ou se o servidor está online.';
          break;
      }

      messageService.add({
        severity: 'error',
        summary: summary,
        detail: userMessage,
        life: 5000,
      });

      return throwError(() => error);
    })
  );
};
