import { UserSessionKeyStub, UserSessionStub } from "../stubs/userSession.stub";

export const SessionsServiceMock = jest.fn().mockReturnValue({
  getUserSessionCacheKey: jest.fn().mockReturnValue( UserSessionKeyStub() ),
  create: jest.fn().mockImplementation(() => Promise.resolve()),
  update: jest.fn().mockImplementation(() => Promise.resolve()),
  findOne: jest.fn().mockResolvedValue( UserSessionStub() ),
  deleteOne: jest.fn().mockImplementation(() => Promise.resolve()),
  IsLoggedIn: jest.fn().mockResolvedValue( Promise.resolve(true)),
  setSession: jest.fn().mockImplementation(() => Promise.resolve()),
  getSession: jest.fn().mockResolvedValue( UserSessionStub() ),
  deleteSession: jest.fn().mockImplementation(() => Promise.resolve()),
  buildUserSession: jest.fn().mockReturnValue( UserSessionStub() ),
})
