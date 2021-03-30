import apis from '../../api/index';

export const usernameAvailable = async username => {
  const result = {}
  try {
    const res = await apis.edge.usernameAvailable(username)

    if (!res) {
      result.error = 'Not available'
    }
  } catch (e) {
    result.error = e.message
  }

  return result
}

export const checkPassword = async (password, passwordRepeat) => {
  const result = {}
  try {
    const res = await apis.edge.checkPasswordRules(password, passwordRepeat)

    if (!res) {
      result.error = 'Password is invalid'
    }
  } catch (e) {
    result.error = e.message
  }

  return result
}

export const checkUsernameAndPassword = async (username, password, passwordRepeat) => {
  const result = { errors: {} }
  const { error: usernameError } = await usernameAvailable(username)
  const { error: passwordError } = await checkPassword(password, passwordRepeat)
  if (usernameError) {
    result.errors.email = usernameError
  }
  if (passwordError) {
    result.errors.password = passwordError
  }

  return result
}

export const createAccount = async (username, password, pin) => {
  const result = { errors: {} }
  try {
    const account = await apis.edge.signup(username, password, pin)
  } catch (e) {
    console.log(e);
    result.errors = { email: e.message }
  }

  return result
}
