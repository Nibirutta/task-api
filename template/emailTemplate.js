const template = `
<body style="margin:0;padding:0;background-color:#DBE2EF;color:#112d4e;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#DBE2EF;">
    <tr>
      <td>
        <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
          <!-- Header (faixa superior) -->
          <tr>
            <td style="background-color:#3f72af;height:100px;width:100%;"></td>
          </tr>
          <!-- Conteúdo principal -->
          <tr>
            <td style="padding:40px 20px 40px 20px;text-align:center;">
              <h1 style="font-size:2rem;margin:0 0 20px 0;">Task Manager</h1>
              <div style="font-size:1.5rem;">
                <p>Olá, {{USER}}.</p>
                <p>Recebemos uma solicitação para redefinição de senha.</p>
                <p>Para criar a sua nova senha, basta acessar o link a seguir.</p>
                <a href="http://127.0.0.1:5500/reset.html?token={{RESET_TOKEN}}" style="text-decoration:none;color:#3f72af;font-weight:bold;">
                  Alterar senha
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer (faixa inferior) -->
          <tr>
            <td style="background-color:#3f72af;height:100px;width:100%;"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`;

module.exports = template;