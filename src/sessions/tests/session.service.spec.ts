import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { UserStub } from '../../users/tests/stubs/user.stub';
import { CacheService } from '../../cache/services/cache.service';
import { CacheServiceMock } from '../../cache/tests/mocks/cache.service';
import { IUserSession } from '../dto/userSession.dto';
import { SessionsService } from '../services/session.service';
import { UserSessionKeyStub, UserSessionStub } from './stubs/userSession.stub';


describe('SessionsService', () => {
	let sessionsService:SessionsService;
	let cacheService:CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
				SessionsService,
				{
					provide: CacheService,
					useValue: CacheServiceMock
				}
			],
    }).compile();
    sessionsService = module.get<SessionsService>(SessionsService);
    cacheService = module.get<CacheService>(CacheService);
		jest.clearAllMocks();
	});

  it('should be defined', () => {
    expect(sessionsService).toBeDefined();
  });

	describe('getUserSessionCacheKey',()=>{
		let userId:mongoose.Types.ObjectId
		beforeEach( ()=>{
			userId = new mongoose.Types.ObjectId()
		})

		it('should be return user session key in cache', () => {
			let expectedResult = "session:"+userId.toString()
			expect(sessionsService.getUserSessionCacheKey( userId )).toEqual( expectedResult );
		});
	})

	describe('create',()=>{
		let user:User
		let userSessionKey:string
		let expectedUserSession:IUserSession
		let userSession:any
		
		beforeEach( async ()=>{
			user = UserStub()
			userSessionKey = UserSessionKeyStub({ _id: user._id })
			expectedUserSession = UserSessionStub({ _id: user._id })

			sessionsService.buildUserSession = jest.fn().mockReturnValue( expectedUserSession )
			sessionsService.getUserSessionCacheKey = jest.fn().mockReturnValue( userSessionKey )
			sessionsService.setSession = jest.fn()
			await sessionsService.create( user )
		})

		test('then it should call buildUserSession', () => {
			expect(sessionsService.buildUserSession).toHaveBeenCalledWith( user );
		})

		test('then it should call getUserSessionCacheKey', () => {
			expect(sessionsService.getUserSessionCacheKey).toHaveBeenCalledWith( user._id );
		})
		
		test('then it should call setSession', () => {
			expect(sessionsService.setSession).toHaveBeenCalledWith( userSessionKey, expectedUserSession);
		})

	})

	describe('findOne',()=>{
		let userId:mongoose.Types.ObjectId
		let userSessionKey:string
		let expectedUserSession:IUserSession
		let userSession:any
		
		beforeEach( async ()=>{
			userId = new mongoose.Types.ObjectId()
			userSessionKey = UserSessionKeyStub({ _id: userId })
			expectedUserSession = UserSessionStub({ _id: userId })

			sessionsService.getUserSessionCacheKey = jest.fn().mockReturnValue( userSessionKey )
			sessionsService.getSession = jest.fn().mockResolvedValue( expectedUserSession )
			userSession = await sessionsService.findOne( userId )
		})

		test('then it should call getUserSessionCacheKey', () => {
			expect(sessionsService.getUserSessionCacheKey).toHaveBeenCalledWith( userId );
		})
		
		test('then it should call getUserSessionCacheKey', () => {
			expect(sessionsService.getSession).toHaveBeenCalledWith( userSessionKey );
		})

		test('then userSession should equal expectedUserSession', () => {
			expect(userSession).toEqual( expectedUserSession );
		})
	})

	describe('deleteOne',()=>{
		let userId:mongoose.Types.ObjectId
		let userSessionKey:string
		
		beforeEach( async ()=>{
			userId = new mongoose.Types.ObjectId()
			userSessionKey = UserSessionKeyStub({ _id: userId })

			sessionsService.getUserSessionCacheKey = jest.fn().mockReturnValue( userSessionKey )
			sessionsService.deleteSession = jest.fn()
			await sessionsService.deleteOne( userId )
		})

		test('then it should call getUserSessionCacheKey', () => {
			expect(sessionsService.getUserSessionCacheKey).toHaveBeenCalledWith( userId );
		})
		
		test('then it should call deleteSession', () => {
			expect(sessionsService.deleteSession).toHaveBeenCalledWith( userSessionKey );
		})
	})

	describe('getSession',()=>{
		let userSessionKey:string
		beforeEach( async ()=>{
			userSessionKey = UserSessionKeyStub()

			await sessionsService.getSession( userSessionKey);
		})

		test('then it should call get function in cacheService', () => {
			expect(cacheService.get).toHaveBeenCalledWith( userSessionKey );
		})
	})

	describe('setSession',()=>{
		let userSessionKey:string
		let userSession:IUserSession
		beforeEach( async ()=>{
			userSessionKey = UserSessionKeyStub()
			userSession = UserSessionStub()

			await sessionsService.setSession( userSessionKey, userSession);
		})

		test('then it should call set function in cacheService', () => {
			expect(cacheService.set).toHaveBeenCalledWith( userSessionKey, userSession );
		})
	})

	describe('deleteSession',()=>{
		let userSessionKey:string
		beforeEach( async ()=>{
			userSessionKey = UserSessionKeyStub()

			await sessionsService.deleteSession( userSessionKey);
		})

		test('then it should call del function in cacheService', () => {
			expect(cacheService.del).toHaveBeenCalledWith( userSessionKey );
		})
	})


	// describe('getSession',()=>{
	// 	it('should be call get function in CacheService', () => {
	// 		expect(cacheService.get).toBeCalled();
	// 	});
	// })


	// describe("manageNotification",()=>{
	// 	let Session:Session
		// beforeEach( ()=>{
		// 	Session = { 
		// 		url: "",
		// 		protocol: "https",
		// 		name:"",
		// 		status: Sessionstatus.UP,
		// 		threshold: 15
		// 	}

		// 	SessionJobService.sendWebHook = jest.fn()
		// 	SessionJobService.findSessionFailsCount =jest.fn().mockResolvedValue(10)
		// })

		// afterEach(() => {
		// 	jest.clearAllMocks()
		// });

	// 	it('should call sendWebHook and notification because Session status is changed and now is UP', async ()=>{
	// 		const sendWebHookSpy = jest.spyOn(SessionJobService, 'sendWebHook');
	// 		// const findSessionFailsCountSpy = jest.spyOn(SessionJobService, 'findSessionFailsCount');
	// 		const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
	// 		const isStatusChanged = true;

	// 		await SessionJobService.manageNotification(Session, isStatusChanged )
  //     expect(sendWebHookSpy).toBeCalledTimes(1);
  //     expect(sendNotificationsServiceSpy).toBeCalledTimes(1);
	// 	})
		
	// 	it('should call sendWebHook only because Session status is changed and now is Down and threshold has not exceeded', async ()=>{
	// 		const sendWebHookSpy = jest.spyOn(SessionJobService, 'sendWebHook');
	// 		const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
	// 		const isStatusChanged = true;
	// 		Session.status = Sessionstatus.DOWN

	// 		await SessionJobService.manageNotification(Session, isStatusChanged )
  //     expect(sendWebHookSpy).toBeCalledTimes(1);
  //     expect(sendNotificationsServiceSpy).toBeCalledTimes(0);
	// 	})

	// 	it('should call notification only because Session status is not changed and now is Down and threshold has exceeded', async ()=>{
	// 		const sendWebHookSpy = jest.spyOn(SessionJobService, 'sendWebHook');
	// 		const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
	// 		const isStatusChanged = false;
	// 		Session.status = Sessionstatus.DOWN
	// 		Session.threshold = 5
			
	// 		await SessionJobService.manageNotification(Session, isStatusChanged )
  //     expect(sendWebHookSpy).toBeCalledTimes(0);
  //     expect(sendNotificationsServiceSpy).toBeCalledTimes(1);
	// 	})

	// 	it('should not call because Session status is not changed and now is Down and threshold has not exceeded', async ()=>{
	// 		const sendWebHookSpy = jest.spyOn(SessionJobService, 'sendWebHook');
	// 		const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
	// 		const isStatusChanged = false;
	// 		Session.status = Sessionstatus.DOWN
			
	// 		await SessionJobService.manageNotification(Session, isStatusChanged )
  //     expect(sendWebHookSpy).toBeCalledTimes(0);
  //     expect(sendNotificationsServiceSpy).toBeCalledTimes(0);
	// 	})

	// })

	// describe('getSessionstatus',()=>{
		
	// 	it('should be return status Up with statusCode as input', () => {
	// 		const assert:SessionAssertDto = { statusCode: 302 }
	// 		const response:AxiosResponse = { status: 302,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(SessionJobService.getSessionstatus( assert, response )).toEqual( Sessionstatus.UP );
	// 	});
	
	// 	it('should be return status Up without statusCode as input', () => {
	// 		let assert:SessionAssertDto
	// 		const response:AxiosResponse = { status: 200,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(SessionJobService.getSessionstatus( assert, response )).toEqual( Sessionstatus.UP );
	// 	});

	// 	it('should be return status Down with statusCode as input', () => {
	// 		const assert:SessionAssertDto = { statusCode: 302 }
	// 		const response:AxiosResponse = { status: 200,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(SessionJobService.getSessionstatus( assert, response )).toEqual( Sessionstatus.DOWN );
	// 	});

	// 	it('should be return status Down with statusCode as input', () => {
	// 		let assert:SessionAssertDto
	// 		const response:AxiosResponse = { status: 302,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(SessionJobService.getSessionstatus( assert, response )).toEqual( Sessionstatus.DOWN );
	// 	});
	// })

	// describe('convertHeadersToObject',()=>{
		
	// 	it('should be return headers as object', () => {
	// 		const headersArr:SessionHeaderDto[] = [ 
	// 			{key:"header1",value:"val1"},
	// 			{key:"header2",value:"val2"}
	// 		]
	// 		const headersObject = { 
	// 			header1 : "val1",
	// 			header2 : "val2"
	// 		} 
	// 		expect(SessionJobService.convertHeadersToObject( headersArr )).toEqual( headersObject );
	// 	});
	
	// })

});
