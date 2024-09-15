const deleteButton = document.getElementById('delete-button')
const memberNameSpan = document.getElementById('member-name')
const memberEmailSpan = document.getElementById('member-email')
const logoutButton = document.getElementById('logout-button')

document.addEventListener('DOMContentLoaded', () => {
  fetchMemberData()
})

deleteButton.addEventListener('click', async () => {
  const confirmation = confirm('Você tem certeza que deseja deletar seu perfil? Essa ação não pode ser desfeita.')
  if (confirmation) {
    try {
      const response = await fetch('/api/member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await response.json()
      if (response.ok) {
        alert(result.message)
        window.location.href = '/login'
      } else {
        alert(result.error || 'Erro ao excluir perfil')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao se conectar com o servidor.')
    }
  }
})

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
})

async function fetchMemberData() {
  try {
    const response = await fetch('/api/member', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const memberData = await response.json()
    if (response.ok) {
      memberNameSpan.textContent = memberData.name
      memberEmailSpan.textContent = memberData.email
    } else {
      alert(memberData.error || 'Erro ao carregar dados do membro')
      window.location.href = '/login'
    }
  } catch (error) {
    console.error('Erro:', error)
    alert('Erro ao se conectar com o servidor.')
  }
}
