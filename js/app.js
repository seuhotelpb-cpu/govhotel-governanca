// GOVHOTEL - Sistema de Governança
// Carregamento de arrumações e quartos pelo Supabase

document.addEventListener('DOMContentLoaded', async () => {

  console.log('GOVHOTEL iniciado com sucesso.');

  const areaArrumacoes = document.getElementById('lista-arrumacoes');
  const listaQuartos = document.getElementById('lista-quartos');
  const totalQuartos = document.getElementById('total-quartos');

  // ========================================
  // CARREGAR ARRUMAÇÕES
  // ========================================

  if (areaArrumacoes) {

    areaArrumacoes.innerHTML = '<p>Carregando arrumações...</p>';

    try {

      const { data: arrumacoes, error } = await supabaseClient
        .from('arrumacoes')
        .select(`
          id,
          quarto_id,
          camareira,
          tipo_servico,
          status,
          inicio,
          fim
        `)
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      if (!arrumacoes || arrumacoes.length === 0) {

        areaArrumacoes.innerHTML =
          '<p>Nenhuma arrumação registrada no momento.</p>';

      } else {

        // Busca os quartos para relacionar ID com número
        const { data: quartos, error: erroQuartos } = await supabaseClient
          .from('quartos')
          .select('id, numero, andar, categoria');

        if (erroQuartos) {
          throw erroQuartos;
        }

        const mapaQuartos = {};

        (quartos || []).forEach((quarto) => {
          mapaQuartos[quarto.id] = quarto;
        });

        areaArrumacoes.innerHTML = arrumacoes
          .map((arrumacao) => {

            const quarto = mapaQuartos[arrumacao.quarto_id];

            const numeroQuarto = quarto
              ? quarto.numero
              : `ID ${arrumacao.quarto_id}`;

            const categoria = quarto
              ? quarto.categoria
              : 'Não informada';

            return `
              <div class="arrumacao-card">

                <h3>Quarto ${numeroQuarto}</h3>

                <p>
                  <strong>Categoria:</strong>
                  ${categoria}
                </p>

                <p>
                  <strong>Camareira:</strong>
                  ${arrumacao.camareira || '-'}
                </p>

                <p>
                  <strong>Serviço:</strong>
                  ${arrumacao.tipo_servico || '-'}
                </p>

                <p>
                  <strong>Status:</strong>
                  ${arrumacao.status || '-'}
                </p>

              </div>
            `;
          })
          .join('');

        console.log(`${arrumacoes.length} arrumação(ões) carregada(s).`);
      }

    } catch (erro) {

      console.error('Erro ao carregar arrumações:', erro);

      areaArrumacoes.innerHTML =
        '<p>Não foi possível carregar as arrumações.</p>';
    }
  }

  // ========================================
  // CARREGAR TODOS OS QUARTOS
  // ========================================

  if (listaQuartos && totalQuartos) {

    listaQuartos.innerHTML = '<p>Carregando quartos...</p>';

    try {

      const { data: quartos, error: erroQuartos } = await supabaseClient
        .from('quartos')
        .select('id, numero, andar, categoria, ativo')
        .eq('ativo', true)
        .order('numero', { ascending: true });

      if (erroQuartos) {
        throw erroQuartos;
      }

      totalQuartos.textContent = quartos ? quartos.length : 0;

      if (!quartos || quartos.length === 0) {

        listaQuartos.innerHTML =
          '<p>Nenhum quarto cadastrado.</p>';

        return;
      }

      listaQuartos.innerHTML = quartos
        .map((quarto) => {

          return `
            <div class="quarto-card">

              <strong>Quarto ${quarto.numero}</strong><br>

              Categoria:
              ${quarto.categoria || 'Não informada'}
              <br>

              Andar:
              ${quarto.andar}

            </div>
          `;
        })
        .join('');

      console.log(`${quartos.length} quarto(s) carregado(s).`);

    } catch (erro) {

      console.error('Erro ao carregar quartos:', erro);

      totalQuartos.textContent = 'Erro';

      listaQuartos.innerHTML =
        '<p>Não foi possível carregar os quartos.</p>';
    }
  }

});
